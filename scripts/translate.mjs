// src/ の日本語の文言を集め、まだ英訳がないものだけを Claude で英訳して src/i18n/en.json に書き出す。
//   npm run translate          … 未翻訳を英訳する（デプロイ前に自動で走る）
//   npm run translate -- --check … 翻訳せず、未翻訳があれば一覧を出して失敗する
//   npm run translate -- --retranslate "日本語" … 指定した文言を訳し直す
// 訳を手で直したいときは src/i18n/en.manual.json に { "日本語": "English" } を書く（こちらが優先され、自動では上書きされない）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const I18N = path.join(SRC, 'i18n');
const AUTO_PATH = path.join(I18N, 'en.json');
const MANUAL_PATH = path.join(I18N, 'en.manual.json');

const MODEL = 'claude-opus-5-5';
const BATCH_SIZE = 60;
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

// ---------- 英訳 ----------

const SYSTEM = `You translate the Japanese text of a personal portfolio website into natural, polished English.
The site belongs to Taka10, a Japanese graduate student (Kyoto Institute of Technology) who researches games x AI, leads the student game studio "TOMSN", and will join a game company as a game planner (game designer) in spring 2027. Readers are recruiters and game developers outside Japan.

Rules:
- Write concise, confident English suited to a professional portfolio. Do not translate word-for-word; convey the intent.
- Keep proper nouns, product names and handles as they are (Taka10, TOMSN, BitSummit, unityroom, note, Unity, C#, etc.).
- Game titles: give a natural English title. For wordplay that cannot carry over, choose a playful English equivalent.
- "\\n" is a line break. Return exactly the same number of lines as the input, in the same order (lines may be lists or paragraphs). Break English lines at natural phrase boundaries.
- Keep "**bold**" markers around the corresponding English phrase.
- Short UI labels (buttons, headings, tags) stay short. Use Title Case only for headings and navigation-like labels.
- Use the existing translations as a glossary so terms stay consistent.`;

const SCHEMA = {
  type: 'object',
  properties: {
    translations: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'integer' }, en: { type: 'string' } },
        required: ['id', 'en'],
        additionalProperties: false,
      },
    },
  },
  required: ['translations'],
  additionalProperties: false,
};

const count = (text, token) => text.split(token).length - 1;
const isValid = (ja, en) => en.trim() !== ''
  && count(ja, '\n') === count(en, '\n')
  && count(ja, '**') === count(en, '**');

const translateBatch = async (client, items, glossary) => {
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{
      role: 'user',
      content: JSON.stringify({
        existing_translations: glossary,
        translate: items.map((ja, id) => ({ id, ja })),
      }),
    }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === 'refusal') throw new Error('Claude が翻訳を断りました');
  if (message.stop_reason === 'max_tokens') throw new Error('出力が上限に達しました。BATCH_SIZE を下げてください');

  const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const { translations } = JSON.parse(text);
  return new Map(translations.map(({ id, en }) => [items[id], en]));
};

const translateAll = async (missing, glossary) => {
  const client = new Anthropic();
  const result = {};
  let pending = missing;

  // 改行数や ** の数が合わなかったものは1回だけ訳し直す
  for (let attempt = 0; attempt < 2 && pending.length > 0; attempt += 1) {
    const retry = [];
    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE);
      console.log(`  英訳中… ${Math.min(i + BATCH_SIZE, pending.length)} / ${pending.length}`);
      const translated = await translateBatch(client, batch, { ...glossary, ...result });
      for (const ja of batch) {
        const en = translated.get(ja);
        if (en && isValid(ja, en)) result[ja] = en;
        else if (attempt === 0) retry.push(ja);
        else if (en) {
          console.warn(`  ! 改行または ** の数が原文と違います（そのまま採用）: ${ja.slice(0, 40)}`);
          result[ja] = en;
        }
      }
    }
    pending = retry;
  }
  return result;
};

// ---------- main ----------

const main = async () => {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const retranslate = new Set(args
    .filter((_, i) => args[i - 1] === '--retranslate')
    .map(normalize));

  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    // .env がなければ環境変数か `ant auth login` の認証情報を使う
  }

  const { texts, warnings } = collect();
  const auto = readJson(AUTO_PATH);
  const manual = readJson(MANUAL_PATH);

  if (warnings.length > 0) {
    console.warn(`⚠ 英語に切り替わらない日本語が ${warnings.length} か所あります:`);
    warnings.forEach((w) => console.warn(`  ${w}`));
  }

  const current = new Set(texts);
  const stale = Object.keys(auto).filter((ja) => !current.has(ja) || retranslate.has(ja));
  const missing = texts.filter((ja) => !(ja in manual) && (!(ja in auto) || retranslate.has(ja)));

  if (checkOnly) {
    if (missing.length > 0) {
      console.error(`未翻訳の文言が ${missing.length} 件あります:`);
      missing.forEach((ja) => console.error(`  - ${ja.replace(/\n/g, '⏎')}`));
      process.exit(1);
    }
    console.log(`✓ すべて英訳済みです（${texts.length} 件）`);
    return;
  }

  // もう使われていない文言の訳は消す
  stale.forEach((ja) => delete auto[ja]);

  if (missing.length === 0) {
    if (stale.length > 0) writeJson(AUTO_PATH, auto);
    console.log(`✓ 未翻訳の文言はありません（${texts.length} 件${stale.length ? `、不要な訳を ${stale.length} 件削除` : ''}）`);
    return;
  }

  console.log(`未翻訳の文言が ${missing.length} 件あります。${MODEL} で英訳します`);
  let translated;
  try {
    translated = await translateAll(missing, { ...auto, ...manual });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('✗ API キーが無効です。.env の ANTHROPIC_API_KEY を確認してください');
    } else if (error instanceof Anthropic.APIError) {
      console.error(`✗ API エラー ${error.status}: ${error.message}`);
    } else if (/auth|api.?key/i.test(String(error?.message))) {
      console.error('✗ API キーが見つかりません。プロジェクト直下の .env に ANTHROPIC_API_KEY=... を書いてください');
    } else {
      console.error(`✗ ${error.message}`);
    }
    process.exit(1);
  }

  writeJson(AUTO_PATH, { ...auto, ...translated });
  console.log(`✓ ${Object.keys(translated).length} 件を英訳して src/i18n/en.json に保存しました`);
  Object.entries(translated).forEach(([ja, en]) => {
    console.log(`  ${ja.replace(/\n/g, '⏎').slice(0, 30)}  →  ${en.replace(/\n/g, '⏎').slice(0, 60)}`);
  });
};

main();
