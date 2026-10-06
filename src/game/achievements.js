import { emit } from './bus';

// 解除済みの実績はブラウザに保存し、同じ通知を二度出さない
export const ACHIEVEMENTS = {
  firstKill: { title: '初撃破', desc: '背景の敵をはじめて倒した' },
  kill10: { title: 'エースパイロット', desc: '背景の敵を10体倒した' },
  cometKill: { title: 'シューティングスター', desc: '白く速い敵を撃ち落とした' },
  allSections: { title: '全セクション踏破', desc: 'すべてのセクションを訪れた' },
  works3: { title: '作品鑑賞家', desc: '作品の詳細を3つ開いた' },
  readToEnd: { title: '最後まで読んだ', desc: 'ページのいちばん下までたどり着いた' },
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
