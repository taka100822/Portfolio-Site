import {
  FaDraftingCompass, FaLightbulb, FaClipboardList, FaFileAlt, FaMap, FaLanguage, FaTable,
  FaCode,
  FaChartBar, FaPoll, FaBalanceScale,
  FaUsers, FaFlag, FaTasks, FaCrown, FaUserFriends,
} from 'react-icons/fa';
import {
  SiUnity, SiC, SiPython, SiReact, SiGithub, SiBlender, SiMicrosoftexcel, SiR,
} from 'react-icons/si';

// About の「搭載スキル」。上から順に表示
export const skillsData = [
  {
    title: '企画',
    icon: FaDraftingCompass,
    items: [
      { name: '企画立案', icon: FaLightbulb },
      { name: '企画書制作', icon: FaClipboardList },
      { name: '仕様書作成', icon: FaFileAlt },
      { name: 'レベルデザイン', icon: FaMap },
      { name: 'ローカライズ', icon: FaLanguage },
      { name: 'データ入稿', icon: FaTable },
    ],
  },
  {
    title: '実装',
    icon: FaCode,
    items: [
      { name: 'Unity / C#', icon: SiUnity },
      { name: 'C', icon: SiC },
      { name: 'Python', icon: SiPython },
      { name: 'JavaScript / React', icon: SiReact },
      { name: 'Git / GitHub', icon: SiGithub },
      { name: 'Blender', icon: SiBlender },
    ],
  },
  {
    title: '分析',
    icon: FaChartBar,
    items: [
      { name: 'Excel', icon: SiMicrosoftexcel },
      { name: 'R', icon: SiR },
      { name: 'UEQ', icon: FaPoll },
      { name: '多重比較（Bonferroni, Tukey）', icon: FaBalanceScale },
    ],
  },
  {
    title: 'チーム運営',
    icon: FaUsers,
    items: [
      { name: 'リーダーシップ', icon: FaCrown },
      { name: 'プロジェクト管理', icon: FaTasks },
      { name: 'チーム運営', icon: FaUserFriends },
      { name: '組織立ち上げ', icon: FaFlag },
    ],
  },
];
