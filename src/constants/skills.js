import { FaGamepad, FaUnity, FaChartBar, FaUsers, FaCode, FaLayerGroup } from 'react-icons/fa';

export const skillsData = [
  {
    icon: FaGamepad,
    title: 'Game Planning',
    description: 'ゲーム企画・仕様書作成',
    details: ['企画立案', '仕様書作成', 'レベルデザイン', 'ローカライズ'],
    color: '#ef4444',
  },
  {
    icon: FaUnity,
    title: 'Game Development',
    description: '2D/3D ゲーム開発',
    details: ['Unity Engine', 'プロトタイプ作成', 'デバッグ', 'ブラッシュアップ'],
    color: '#3b82f6',
  },
  {
    icon: FaChartBar,
    title: 'Data Analysis',
    description: 'データ分析・ユーザー行動解析',
    details: ['Excel', 'R', 'UEQ', '多重比較（Bonferroni, Tukey）'],
    color: '#10b981',
  },
  {
    icon: FaUsers,
    title: 'Team Management',
    description: 'チーム開発・進行管理',
    details: ['リーダーシップ', 'プロジェクト管理', '組織立ち上げ', 'チーム運営'],
    color: '#f59e0b',
  },
  {
    icon: FaCode,
    title: 'Technical Skills',
    description: 'プログラミング・技術スキル',
    details: ['C', 'C#', 'Python', 'JavaScript', 'React', 'Git/GitHub', 'Blender'],
    color: '#8b5cf6',
  },
  {
    icon: FaLayerGroup,
    title: 'Other Skills',
    description: 'その他スキル',
    details: ['やる気', '根性', '忍耐力', '熱意', '行動力', '継続力'],
    color: '#ec4899',
  },
];
