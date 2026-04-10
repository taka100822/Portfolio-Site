import { FaStickyNote, FaGithub, FaGamepad } from 'react-icons/fa';
import { CiWavePulse1 } from 'react-icons/ci';

export const linksData = [
  {
    title: 'GitHub',
    description: '制作物のソースコードを公開しています',
    url: 'https://github.com/Taka100822',
    icon: FaGithub,
    color: '#333333',
  },
  {
    title: 'note',
    description: 'ゲーム開発の記録や読んだ書籍に関する記事などを投稿しています',
    url: 'https://note.com/Taka10822',
    icon: FaStickyNote,
    color: '#ffffff',
  },
  {
    title: 'unityroom',
    description: '制作したゲームを公開・配信しているプラットフォーム',
    url: 'https://unityroom.com/users/taka_unityroom',
    icon: FaGamepad,
    color: '#e60012',
  },
  {
    title: 'PULSE',
    description: '今までプレイしたゲームの記録を公開',
    url: 'https://plsdb.com/profile/taka10822',
    icon: CiWavePulse1,
    color: '#baeb34',
  },
];
