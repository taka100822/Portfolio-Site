import { emit } from './bus';

// 解除済みの実績はブラウザに保存し、同じ通知を二度出さない。
// hint は実績一覧で、まだ解除していないものに名前の代わりに出す
export const ACHIEVEMENTS = {
  firstKill: { title: '初撃破', desc: '背景の敵をはじめて倒した', hint: '背景の敵を撃ってみよう' },
  kill10: { title: 'エースパイロット', desc: '背景の敵を10体倒した', hint: '背景の敵をもっと倒そう' },
  cometKill: { title: 'シューティングスター', desc: '白く速い敵を撃ち落とした', hint: '白くて速い敵がいるらしい' },
  allSections: { title: '全セクション踏破', desc: 'すべてのセクションを訪れた', hint: 'ページをひと通り見てみよう' },
  works3: { title: '作品鑑賞家', desc: '作品の詳細を3つ開いた', hint: '作品の詳細をいくつか開いてみよう' },
  readToEnd: { title: '最後まで読んだ', desc: 'ページのいちばん下までたどり着いた', hint: 'ページのいちばん下には…' },
};

const STORAGE_KEY = 'achievements';

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
};

const unlocked = load();

export const isUnlocked = (id) => unlocked.has(id);

export const unlock = (id) => {
  if (!ACHIEVEMENTS[id] || unlocked.has(id)) return;
  unlocked.add(id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]));
  } catch {
    // 保存できなくても、このページを開いている間は二度出さない
  }
  emit('achievement', { id, ...ACHIEVEMENTS[id] });
};
