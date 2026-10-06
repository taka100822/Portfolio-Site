// achievement があるものは受賞・発表としてトロフィー付きで強調する
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
    description: '100人規模のサークル代表に就任しました。\n引き継ぎがない中で新歓や合宿を企画し、大人数をまとめる難しさを学びました。',
    type: 'experience',
    details: ['リーダー経験', '企画', '留学生との交流'],
  },
  {
    year: '2024', month: '04',
    title: '初めての共同開発',
    description: '研究室のメンバーと冷蔵庫の食品管理問題を解決すべくWebアプリを作成しました。\n先輩方に引っ張ってもらいながらチーム開発のノウハウを学びました。',
    type: 'project',
    details: ['チーム開発', 'Git/GitHub', 'Nuxt3', 'Vue.js'],
  },
  {
    year: '2024', month: '07',
    title: '卒業研究（初めてのゲーム制作）',
    description: '卒業研究である「テキストによる視覚情報の多寡がゲーム体験に与える影響」を\n調べるための実験用に2Dアクションゲームを開発しました。',
    type: 'education',
    details: ['個人開発', '卒業研究', 'Unity', 'C#', '視覚情報'],
  },
  {
    year: '2024', month: '10',
    title: 'ゲーム会社でのアルバイトを開始',
    description: 'ゲーム会社でプランナー兼プログラマーとしてアルバイトを始め、\n『POGO・Stadium』の開発に参加しました。\nまた、電子工作のテストプレイや3Dスキャンなども経験しました。',
    type: 'experience',
    details: ['中規模開発', 'アルバイト', 'Unity', 'Google Workspace'],
  },
  {
    year: '2025', month: '04',
    title: 'unity1weekjamに参加',
    description: '初めてゲームジャムに参加し、「わけあい」を個人制作しました。\nフィードバックをいただき、企画の難しさを実感しました。',
    type: 'game',
    details: ['個人開発', 'ゲームジャム', 'Unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/n25c7fc449fc2?sub_rt=share_pw',
  },
  {
    year: '2025', month: '05',
    title: '研究室の3Dデータを用いたマルチプレイ脱出ゲームを開発',
    description: '私の研究室が数年で閉鎖になることを知り、思い出を残すために、3Dスキャンデータを\n活用したマルチプレイ脱出ゲームを開発しました。\nゲーム内には教授や私（3Dモデル）がNPCとして登場します。',
    type: 'game',
    details: ['チーム開発', 'Unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/n9031b5fbc073?sub_rt=share_pw',
  },
  {
    year: '2025', month: '06',
    title: '学会発表',
    achievement: '学会で研究発表',
    description: '学術的な挑戦として、単身で学会に参加し、\n学部卒業研究の成果を執筆（卒業論文とは別）、発表しました。',
    type: 'education',
    details: ['論文執筆', 'スライド発表', 'LaTeX'],
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
    description: '私が設立した学生ゲーム制作団体「TOMSN」で開発したゲームを公開しました。\nリーダーとしてチームの進行管理を行い、長期のチーム開発経験を得ました。',
    type: 'game',
    details: ['チーム開発', 'Unity', 'C#', 'Blender'],
    noteLink: 'https://note.com/taka10822/n/n9265ce5cd160?sub_rt=share_pw',
  },
  {
    year: '2025', month: '07',
    title: 'BitSummit Gamejam 2025 総合グランプリを受賞',
    achievement: 'BitSummit Gamejam 2025 総合グランプリ',
    description: 'BitSummit Gamejam 2025にプランナー兼プログラマーとして参加し、\n制作した『DreamMayday』がBitSummitゲームジャム総合グランプリを受賞しました。\n本ゲームは同年の「ええかんじのゲームガッカイ（EGG）」や「Game Grove X（GGX）\nキックオフイベント」にも展示させていただきました。',
    type: 'game',
    details: ['チーム開発', 'ゲームジャム', 'Unity', 'C#', '最優秀賞'],
    noteLink: 'https://note.com/taka10822/n/nd1916fb6d500?sub_rt=share_pw',
  },
  {
    year: '2025', month: '09',
    title: 'タイの研究室へ短期留学',
    description: '学内のグローバルインターンシッププログラムで、\nタイのカセサート大学の研究室に約2ヶ月間参加し、実践的な語学力を身につけました。',
    type: 'education',
    details: ['留学', '語学力向上', '文化理解'],
    noteLink: 'https://note.com/taka10822/n/n1e5e70ccd7fd?sub_rt=share_pw',
  },
  {
    year: '2026', month: '03',
    title: '2週間のゲームプランナーインターンシップに参加',
    description: '企業様からスカウトいただき、企画チームに参加し、\n2週間の課題型の給与ありインターンシップに参加しました。',
    type: 'experience',
    details: ['運営プランナー', '課題型インターン', '開発現場'],
  },
  {
    year: '2026', month: '05',
    title: '研究室在室状況可視化システムを開発',
    description: 'LANスキャンとRaspberry Piを用いて研究室メンバーの在室状況を物理LEDで可視化し、\nDiscordロールとも自動同期するシステムをチームで開発しました。',
    type: 'project',
    details: ['チーム開発', 'Node.js', 'Raspberry Pi', 'IoT'],
    noteLink: 'https://note.com/taka10822/n/n6e216e414d70?sub_rt=share_pw',
  },
  {
    year: '2026', month: '07',
    title: '学生チーム対抗ゲームジャムに参加',
    description: '東京都武蔵野市で行われた「学生チーム対抗ゲームジャム2026」に参加し、\nパーティーゲーム『ふらちな海賊団』を制作しました。',
    type: 'game',
    details: ['チーム開発', 'ゲームジャム', 'Unity', 'C#'],
    noteLink: 'https://note.com/taka10822/n/nec8736e17f99?sub_rt=share_pw',
  },
  {
    year: '2026', month: '07',
    title: 'unity1week Gamejamに参加',
    description: 'unity1week Gamejamに参加し、Xを通じて集まったメンバーで、\n『米フレンドを残さないで！』を制作しました。',
    type: 'game',
    details: ['チーム開発', 'ゲームジャム', 'Unity', 'C#'],
  },
  {
    year: '2026', month: '08',
    title: '「関西PLATEAU学生アイデアソン」にてオーディエンス賞を受賞',
    achievement: '関西PLATEAU学生アイデアソン2026 オーディエンス賞',
    description: '「関西PLATEAU学生アイデアソン2026 in 京都」に参加し、\n聖地巡礼用SNS『mikata』を企画し、オーディエンス賞を受賞しました。',
    type: 'project',
    details: ['アイデアソン', '3DCG', '社会課題解決'],
  },
    {
    year: '2026', month: '10',
    title: 'TOMSN第2弾として言語解読ADV「フリージア」を制作中',
    description: '学生ゲーム制作団体「TOMSN」にて第2弾の言語解読ADV『フリージア』を制作中です。',
    type: 'game',
    details: ['チーム開発', 'Unity', 'C#', 'Blender', 'GC甲子園2026'],
  },
];

export const TYPE_LABEL = {
  education:   '学び',
  game:        'ゲーム',
  project:     '制作',
  experience:  '経験',
};

export const getTypeLabel = (type) => TYPE_LABEL[type] ?? type;

// 成長の流れが読めるよう、年ではなく章でまとめて古い順に並べる
export const CHAPTERS = [
  {
    title: '土台をつくる',
    years: ['2021', '2022', '2023'],
    summary: 'プログラミングを学び、エンタメに触れ、100人のサークルの代表に就任。',
  },
  {
    title: 'ゲームを作り始める',
    years: ['2024'],
    summary: 'チーム開発を知り、卒業研究とアルバイトでゲーム制作デビュー。',
  },
  {
    title: 'チームを率いる',
    years: ['2025'],
    summary: '制作団体 TOMSN を立ち上げ、ゲームジャムでグランプリを獲得。',
  },
  {
    title: 'さらなる経験を積む',
    years: ['2026'],
    summary: 'プランナーとして現場を経験し、様々な活動に積極的に参加。',
  },
];

export const timelineByChapter = CHAPTERS.map((chapter, i) => ({
  ...chapter,
  number: i + 1,
  period: chapter.years.length > 1
    ? `${chapter.years[0]}–${chapter.years[chapter.years.length - 1]}`
    : chapter.years[0],
  items: timelineData.filter((item) => chapter.years.includes(item.year)),
}));
