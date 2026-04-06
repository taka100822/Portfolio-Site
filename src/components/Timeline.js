import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGamepad, FaCode, FaGraduationCap, FaProjectDiagram, FaTrophy } from 'react-icons/fa';
import './Timeline.css';

const Timeline = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const timelineData = [
    {
      year: '2021',
      month: '05',
      title: 'プログラミング学習開始',
      description: '大学入学と同時に、コンピュータサイエンスの学習を本格的に始めました。',
      icon: FaCode,
      type: 'education',
      details: ['C', 'JAVA', 'アルゴリズム', 'ネットワークプログラミング'],
    },
    {
      year: '2022',
      month: '09',
      title: 'TOEICで710点を取得',
      description: '英語が苦手だった私が努力し、TOEIC Listening & Readingで710点を取得しました。',
      icon: FaGamepad,
      type: 'education',
      details: ['英語学習']
    },
    {
      year: '2022',
      month: '12',
      title: 'さまざまなエンタメに触れる',
      description: '感動を生むコンテンツを作るため、ジャンルを問わず多様なエンタメ作品に触れるようになりました。',
      icon: FaGamepad,
      type: 'experience',
      details: ['韓ドラ', '洋画', 'スポーツ観戦', '小説']
    },
    {
      year: '2023',
      month: '01',
      title: 'バスケサークルの代表に就任',
      description: '周囲からの推薦を受け、100人規模のサークル代表に就任しました。引き継ぎがない中で新歓や合宿を企画し、大人数をまとめる難しさを学びました。',
      icon: FaProjectDiagram,
      type: 'experience',
      details: ['リーダー経験', '企画', '留学生との交流']
    },
    {
      year: '2024',
      month: '04',
      title: '初めての共同開発',
      description: '研究室のメンバーと冷蔵庫の食品管理問題を解決すべくWebアプリを作成しました。先輩方に引っ張ってもらいながらチーム開発のノウハウを学びました。',
      icon: FaGraduationCap,
      type: 'project',
      details: ['チーム開発', 'Git/GitHub', 'Nuxt3', 'Vue.js']
    },
    {
      year: '2024',
      month: '07',
      title: '初めてのゲーム制作',
      description: '卒業研究の一環で、視覚情報がプレイヤの満足度に与える影響を調べるために2Dアクションゲームを開発しました。',
      icon: FaCode,
      type: 'project',
      details: ['個人開発', '卒業研究', '視覚情報', 'unity', 'C#']
    },
    {
      year: '2024',
      month: '08',
      title: 'インターンに参加',
      description: '大学院進学が決まり時間ができたため、インターンに2社参加しました。スマホ電卓アプリやチャットアプリなどを開発しました。',
      icon: FaGraduationCap,
      type: 'experience',
      details: ['Kotlin', 'Android Studio', 'Nuxt.js', 'FireBase']
    },
    {
      year: '2024',
      month: '10',
      title: 'ゲーム会社でのアルバイトを開始',
      description: 'これまでの経験が評価され、ゲーム会社でプランナー兼プログラマーとしてアルバイトを始めました。',
      icon: FaCode,
      type: 'experience',
      details: ['プランナー', 'プログラマー', 'unity', 'GoogleWorkspace']
    },
    {
      year: '2025',
      month: '04',
      title: 'unity1weekjamに参加',
      description: '初めてゲームジャム（Unity1Week）に参加し、企画から開発までを1人で経験しました。短期間での開発の難しさを実感しました。',
      icon: FaCode,
      type: 'project',
      details: ['個人開発', 'unity', 'C#'],
      noteLink: 'https://note.com/taka10822/n/n25c7fc449fc2?sub_rt=share_pw'
    },
    {
      year: '2025',
      month: '05',
      title: '研究室の3Dデータを使用したゲームを開発',
      description: '私の研究室が数年で閉鎖になることを知り、思い出を残すために、3Dスキャンデータを活用したマルチプレイ脱出ゲームを開発しました。',
      icon: FaCode,
      type: 'project',
      details: ['チーム開発', 'unity', 'C#'],
      noteLink: 'https://note.com/taka10822/n/n9031b5fbc073?sub_rt=share_pw'
    },
    {
      year: '2025',
      month: '06',
      title: '学会発表',
      description: '学術的な挑戦として、1人で沖縄県にて学会発表と質疑応答を行いました。',
      icon: FaCode,
      type: 'education',
      details: ['Latex', 'スライド発表', '論文'],
      noteLink: 'https://note.com/Taka10822/n/nfbef8b80eae1'
    },
    {
      year: '2025',
      month: '06',
      title: 'ポートフォリオサイト制作',
      description: 'これまでの経験と制作物を整理し、ポートフォリオサイトを制作しました。',
      icon: FaCode,
      type: 'experience',
      details: ['Claude Code', 'JavaScript', 'React']
    },
    {
      year: '2025',
      month: '06',
      title: 'TOMSN第1弾「CRASH REPORT」をリリース',
      description: '私が設立した学生ゲーム制作チーム「TOMSNで」開発したゲームを公開しました。リーダーとしてチームの進行管理を行い、長期のチーム開発経験を得ました。',
      icon: FaCode,
      type: 'project',
      details: ['Unity', 'C#', 'Blender', 'ゲームクリエイター甲子園2025'],
      noteLink: 'https://note.com/taka10822/n/n9265ce5cd160?sub_rt=share_pw'
    },
    {
      year: '2025',
      month: '07',
      title: 'BitSummit the 13th ゲームジャムアワードを受賞',
      description: 'BitSummitGameJamにプランナー兼プログラマーとして参加したW-12チームの「DreamMayday」がBitSummitゲームジャムアワードを受賞しました。',
      icon: FaCode,
      type: 'project',
      details: ['Unity', 'C#', 'ゲームジャム', '最優秀賞'],
      noteLink: 'https://note.com/taka10822/n/nd1916fb6d500?sub_rt=share_pw'
    },
    {
      year: '2025',
      month: '09',
      title: 'タイの研究室へ短期留学',
      description: '学内のグローバルインターンシッププログラムで、タイのバンコクに6週間短期留学しました。',
      icon: FaCode,
      type: 'education',
      details: ['短期留学','語学力向上','文化理解'],
      noteLink: 'https://note.com/taka10822/n/n1e5e70ccd7fd?sub_rt=share_pw'
    },
    {
      year: '2026',
      month: '03',
      title: '株式会社Colorful Paletteのカスタムインターンゲームプランナーに参加',
      description: '（サイバーエージェントグループ）株式会社Colorful Paletteにて2週間、『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』の企画チームに参加し、課題型のインターンシップを行いました。',
      icon: FaCode,
      type: 'project',
      details: ['運営プランナー','ゲーム内新企画','開発現場'],
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'education': return '#10b981';
      case 'project': return '#3b82f6';
      case 'experience': return '#f59e0b';
      case 'achievement': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <section id="timeline" className="section timeline-section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          Timeline
        </motion.h2>

        <motion.div
          className="timeline"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="timeline-line"></div>
          
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              variants={itemVariants}
            >
              <div className="timeline-content card">
                <div className="timeline-date">
                  <span className="year">{item.year}</span>
                  <span className="month">{item.month}</span>
                </div>
                

                <div className="timeline-info">
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                  
                  <div className="timeline-details">
                    {item.details.map((detail, detailIndex) => (
                      <span key={detailIndex} className="detail-tag">
                        {detail}
                      </span>
                    ))}
                  </div>
                  
                  {item.noteLink && (
                    <div className="timeline-link">
                      <a href={item.noteLink} target="_blank" rel="noopener noreferrer" className="note-link">
                        📝 noteで詳しく見る
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className="timeline-dot"
                style={{ backgroundColor: getTypeColor(item.type) }}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;