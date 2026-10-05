// achievement があるものは画面に入ったとき「実績解除」トーストを出す
export const timelineData = [
  {
    year: '2021', month: '05',
    title: 'プログラミング学習開始',
    description: '大学入学と同時に、コンピュータサイエンスの学習を本格的に始めました。',
    type: 'education',
    details: ['C', 'アルゴリズム', 'ネットワークプログラミング', '論理回路'],
  },
  {
    year: '2022', month: '12',
    title: 'さまざまなエンタメに触れる',
    description: '感動を生むコンテンツを作るため、ジャンルを問わず多様なエンタメ作品に触れるようになりました。',
    type: 'experience',
    details: ['韓ドラ', '洋画', 'スポーツ観戦', '小説', '恋愛リアリティショー'],
  },
  {
    year: '2023', month: '01',
    title: 'バスケットボールサークルの代表に就任',
    description: '100人規模のサークル代表に就任しました。引き継ぎがない中で新歓や合宿を企画し、大人数をまとめる難しさを学びました。',
    type: 'experience',
    details: ['リーダー経験', '企画', '留学生との交流'],
  },
  {
    year: '2024', month: '04',
    title: '初めての共同開発',
    description: '研究室のメンバーと冷蔵庫の食品管理問題を解決すべくWebアプリを作成しました。先輩方に引っ張ってもらいながらチーム開発のノウハウを学びました。',
    type: 'project',
    details: ['チーム開発', 'Git/GitHub', 'Nuxt3', 'Vue.js'],
  },
  {
    year: '2024', month: '07',
    title: '卒業研究（初めてのゲーム制作）',
    description: '卒業研究であるテキストによる視覚情報の多寡がゲーム体験に与える影響を調べるための実験用に2Dアクションゲームを開発しました。',
    type: 'education',
    details: ['個人開発', '卒業研究', '視覚情報', 'unity', 'C#'],
  },
  {
    year: '2024', month: '10',
    title: 'ゲーム会社でのアルバイトを開始',
    description: 'ゲーム会社でプランナー兼プログラマーとしてアルバイトを始め、『POGO・Stadium』の開発に参加しました。',
    type: 'experience',
    details: ['中規模開発', 'アルバイト', 'unity', 'GoogleWorkspace'],
  },
  {
    year: '2025', month: '04',
    title: 'unity1weekjamに参加',
    description: '初めてゲームジャムに参加し、企画から開発までを1人で経験しました。開発の難しさを実感しました。',
    type: 'project',
    details: ['個人開発', 'unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/n25c7fc449fc2?sub_rt=share_pw',
  },
  {
    year: '2025', month: '05',
    title: '研究室の3Dデータを用いたマルチプレイ脱出ゲームを開発',
    description: '私の研究室が数年で閉鎖になることを知り、思い出を残すために、3Dスキャンデータを活用したマルチプレイ脱出ゲームを開発しました。本ゲームには教授や私がNPCとして登場します。',
    type: 'project',
    details: ['チーム開発', 'unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/n9031b5fbc073?sub_rt=share_pw',
  },
  {
    year: '2025', month: '06',
    title: '学会発表',
    achievement: '学会で研究発表',
    description: '学術的な挑戦として、単身で学会に参加し、発表と質疑応答を行いました。',
    type: 'education',
    details: ['Latex', 'スライド発表', '論文執筆'],
    noteLink: 'https://note.com/Taka10822/n/nfbef8b80eae1',
  },
  // {
  //   year: '2025', month: '06',
  //   title: 'ポートフォリオサイト制作',
  //   description: 'これまでの経験と制作物を整理し、本ポートフォリオサイトを制作しました。',
  //   type: 'project',
  //   details: ['Claude Code', 'JavaScript', 'React'],
  // },
  {
    year: '2025', month: '06',
    title: 'TOMSN第1弾「CRASH REPORT」をリリース',
    description: '私が設立した学生ゲーム制作団体「TOMSN」で開発したゲームを公開しました。リーダーとしてチームの進行管理を行い、長期のチーム開発経験を得ました。',
    type: 'project',
    details: ['Unity', 'C#', 'Blender'],
    noteLink: 'https://note.com/taka10822/n/n9265ce5cd160?sub_rt=share_pw',
  },
  {
    year: '2025', month: '07',
    title: 'BitSummit Gamejam 2025 総合グランプリを受賞',
    achievement: 'BitSummit Gamejam 2025 総合グランプリ',
    description: 'BitSummit Gamejam 2025にプランナー兼プログラマーとして参加し、制作した『DreamMayday』がBitSummitゲームジャム総合グランプリを受賞しました。',
    type: 'project',
    details: ['Unity', 'C#', 'ゲームジャム', '最優秀賞'],
    noteLink: 'https://note.com/taka10822/n/nd1916fb6d500?sub_rt=share_pw',
  },
  {
    year: '2025', month: '09',
    title: 'タイの研究室へ短期留学',
    description: '学内のグローバルインターンシッププログラムで、タイのカセサート大学の研究室に約2ヶ月間参加しました。',
    type: 'education',
    details: ['留学', '語学力向上', '文化理解'],
    noteLink: 'https://note.com/taka10822/n/n1e5e70ccd7fd?sub_rt=share_pw',
  },
  {
    year: '2026', month: '03',
    title: '2週間のゲームプランナーインターンシップに参加',
    description: '2週間、企画チームに参加し、課題型のインターンシップを行いました。',
    type: 'experience',
    details: ['運営プランナー', '課題型インターン', '開発現場'],
  },
  {
    year: '2026', month: '05',
    title: '研究室在室状況可視化システムを開発',
    description: 'LANスキャンとRaspberry Piを用いて研究室メンバーの在室状況を物理LEDで可視化し、Discordロールとも自動同期するシステムを個人開発しました。',
    type: 'project',
    details: ['チーム開発', 'Node.js', 'Raspberry Pi', 'IoT'],
    noteLink: 'https://note.com/taka10822/n/n6e216e414d70?sub_rt=share_pw',
  },
  {
    year: '2026', month: '07',
    title: '学生チーム対抗ゲームジャムに参加',
    description: '東京都武蔵野市で行われた学生チーム対抗ゲームジャム2026に参加し、パーティーゲーム『ふらちな海賊団』を制作しました。',
    type: 'project',
    details: ['チーム開発', 'unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/nec8736e17f99?sub_rt=share_pw',
  },
  {
    year: '2026', month: '07',
    title: 'unity1week Gamejamに参加',
    description: 'unity1week Gamejamに参加し、『米フレンドを残さないで！』を制作しました。',
    type: 'project',
    details: ['チーム開発', 'unity', 'C#', 'Gamejam'],
  },
  {
    year: '2026', month: '08',
    title: '「関西PLATEAU学生アイデアソン」にてオーディエンス賞を受賞',
    achievement: '関西PLATEAU学生アイデアソン2026 オーディエンス賞',
    description: '「関西PLATEAU学生アイデアソン2026 in 京都」に参加し、聖地巡礼用SNS『mikata』を企画し、オーディエンス賞を受賞しました。',
    type: 'project',
    details: ['Ideathon', '3DCG', '社会課題解決'],
  },
    {
    year: '2026', month: '10',
    title: 'TOMSN第2弾として言語解読ADV「フリージア」を制作中',
    description: '私が設立した学生ゲーム制作団体「TOMSN」にて第2弾のゲームを制作中です。',
    type: 'project',
    details: ['Unity', 'C#', 'Blender', 'GC甲子園2026'],
  },
];

export const TYPE_LABEL = {
  education:   '学び',
  project:     '制作',
  experience:  '経験',
};

export const getTypeLabel = (type) => TYPE_LABEL[type] ?? type;

// 年ごとにまとめ、新しい順に並べる
export const timelineByYear = Object.entries(
  timelineData.reduce((acc, item) => {
    (acc[item.year] = acc[item.year] || []).push(item);
    return acc;
  }, {})
)
  .map(([year, items]) => ({ year, items: [...items].reverse() }))
  .sort((a, b) => b.year.localeCompare(a.year));
