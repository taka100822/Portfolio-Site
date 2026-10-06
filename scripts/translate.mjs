// src/ の日本語の文言を集め、src/i18n/en.json に英訳がないものを確認する（API は使わない）。
// 英訳は Claude Code に「英訳を更新して」と頼んで入れてもらう。
//   npm run translate                         … 未翻訳がないか確認する（デプロイ前に自動で走り、未翻訳があれば止まる）
//   npm run translate -- --json               … 未翻訳の文言を JSON の配列で出す
//   npm run translate -- --apply 訳.json      … { "日本語": "English" } のファイルを en.json に取り込む
//   npm run translate -- --retranslate "日本語" … 指定した文言の訳を消して未翻訳に戻す
// 訳を手で直したいときは src/i18n/en.manual.json に { "日本語": "English" } を書く（こちらが優先される）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const I18N = path.join(SRC, 'i18n');
const AUTO_PATH = path.join(I18N, 'en.json');
const MANUAL_PATH = path.join(I18N, 'en.manual.json');

const JA = /[぀-ヿ㐀-鿿！-｠]/;

// src/i18n/index.js の normalize と同じ
const normalize = (text) => text.replace(/[ \t]*\n[ \t]*/g, '\n').trim();

const readJson = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {});

const writeJson = (file, data) => {
  const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]));
  fs.writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`);
};

const listFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return full === I18N ? [] : listFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

// ---------- 日本語の文言を集める ----------

// 'a' + 'b' のように文字列だけをつないだ式は1つの文言として扱う
const concatOf = (node) => {
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = concatOf(node.left);
    const right = concatOf(node.right);
    return left !== null && right !== null ? left + right : null;
  }
  return null;
};

const SKIP_KEYS = new Set(['loc', 'start', 'end', 'extra', 'leadingComments', 'trailingComments', 'innerComments', 'comments']);

const collect = () => {
  const texts = new Set();
  const warnings = [];

  for (const file of listFiles(SRC)) {
    const code = fs.readFileSync(file, 'utf8');
    let ast;
    try {
      ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
    } catch (error) {
      throw new Error(`${path.relative(ROOT, file)} を読めません: ${error.message}`);
    }
    const where = (node) => `${path.relative(ROOT, file)}:${node.loc.start.line}`;

    const visit = (node) => {
      if (!node || typeof node.type !== 'string') return;

      // JSX に直接書いた日本語は t() を通らないので英語にならない
      if (node.type === 'JSXText' && JA.test(node.value)) {
        warnings.push(`${where(node)}  JSX に直接書かれています → {t('${node.value.trim()}')} にしてください`);
        return;
      }
      // <img alt="日本語"> のような HTML 要素の属性も同じ（<Row label="…"> のように自作コンポーネントへ渡すものは、受け取った側で t() する）
      if (node.type === 'JSXOpeningElement' && node.name.type === 'JSXIdentifier' && /^[a-z]/.test(node.name.name)) {
        node.attributes.forEach((attr) => {
          if (attr.value?.type === 'StringLiteral' && JA.test(attr.value.value)) {
            warnings.push(`${where(attr)}  属性に直接書かれています → ${attr.name.name}={t('${attr.value.value}')} にしてください`);
          }
        });
      }
      if (node.type === 'TemplateLiteral' && node.expressions.length > 0
        && node.quasis.some((q) => JA.test(q.value.cooked))) {
        warnings.push(`${where(node)}  \${} を含むテンプレート文字列は訳せません。日本語部分だけ t() に分けてください`);
      }

      const text = concatOf(node);
      if (text !== null) {
        const key = normalize(text);
        if (JA.test(key)) texts.add(key);
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        if (SKIP_KEYS.has(key)) continue;
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') visit(value);
      }
    };
    visit(ast.program);
  }

  return { texts: [...texts], warnings };
};

// ---------- 英訳の取り込み ----------

const count = (text, token) => text.split(token).length - 1;

// 改行や ** の数が原文と違うと、担当リストや太字の位置がずれる
const problemOf = (ja, en) => {
  if (typeof en !== 'string' || en.trim() === '') return '訳が空です';
  if (count(ja, '\n') !== count(en, '\n')) return `改行の数が違います（原文 ${count(ja, '\n')} / 訳 ${count(en, '\n')}）`;
  if (count(ja, '**') !== count(en, '**')) return '** の数が違います';
  return null;
};

const apply = (file, texts, auto) => {
  const incoming = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  const current = new Set(texts);
  let added = 0;
  let failed = 0;
  for (const [rawJa, en] of Object.entries(incoming)) {
    const ja = normalize(rawJa);
    const problem = !current.has(ja) ? 'サイトで使われていない文言です' : problemOf(ja, en);
    if (problem) {
      console.error(`  ✗ ${ja.replace(/\n/g, '⏎').slice(0, 40)}: ${problem}`);
      failed += 1;
    } else {
      auto[ja] = en;
      added += 1;
    }
  }
  console.log(`${added} 件の英訳を src/i18n/en.json に取り込みました${failed ? `（${failed} 件は取り込めませんでした）` : ''}`);
  return failed === 0;
};

// ---------- main ----------

const main = () => {
  const args = process.argv.slice(2);
  const valueOf = (flag) => args[args.indexOf(flag) + 1];

  const { texts, warnings } = collect();
  const auto = readJson(AUTO_PATH);
  const manual = readJson(MANUAL_PATH);

  if (warnings.length > 0) {
    console.warn(`⚠ 英語に切り替わらない日本語が ${warnings.length} か所あります:`);
    warnings.forEach((w) => console.warn(`  ${w}`));
  }

  // もう使われていない文言の訳は消す
  const current = new Set(texts);
  const stale = Object.keys(auto).filter((ja) => !current.has(ja));
  stale.forEach((ja) => delete auto[ja]);

  let ok = true;
  if (args.includes('--apply')) ok = apply(valueOf('--apply'), texts, auto);
  if (args.includes('--retranslate')) delete auto[normalize(valueOf('--retranslate'))];
  if (stale.length > 0 || args.includes('--apply') || args.includes('--retranslate')) writeJson(AUTO_PATH, auto);
  if (stale.length > 0) console.log(`使われなくなった訳を ${stale.length} 件削除しました`);

  const missing = texts.filter((ja) => !(ja in manual) && !(ja in auto));

  // Claude Code が文言を正確に受け取れるよう JSON で出す
  if (args.includes('--json')) {
    console.log(JSON.stringify(missing, null, 2));
    return;
  }

  if (missing.length > 0) {
    console.error(`\n未翻訳の文言が ${missing.length} 件あります:`);
    missing.forEach((ja) => console.error(`  - ${ja.replace(/\n/g, '⏎')}`));
    console.error('\nClaude Code に「英訳を更新して」と頼んでください。');
    process.exit(1);
  }
  if (!ok) process.exit(1);
  console.log(`✓ すべて英訳済みです（${texts.length} 件）`);
};

main();
