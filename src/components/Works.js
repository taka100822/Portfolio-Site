import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub, FaGamepad } from 'react-icons/fa';
import './Works.css';

const Works = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [selectedWork, setSelectedWork] = useState(null);

  const works = [
    {
      id: 1,
      title: 'CRASH REPORT',
      category: '3D Action',
      duration: '3ヶ月',
      technology: ['Unity', 'C#', 'Blender'],
      description: '私が立ち上げた学生チーム「TOMSN」で制作した3Dアクションゲーム',
      detailedDescription: '学生5人のチーム「TOMSN」での開発プロジェクト\nプログラマーとプランナーの両方を担当し、ゲームシステムの設計から実装まで幅広く関わりました。チーム開発でのコミュニケーションと進行管理の経験も積むことができました。',
      features: ['チーム開発', 'アジャイル開発', 'Probuilder', '3DCG'],
      image: `${process.env.PUBLIC_URL}/Image/CrashReport.png`,
      links: {}
    },
    {
      id: 2,
      title: '研究室からの脱出',
      category: 'Escape',
      duration: '2ヶ月',
      technology: ['Unity', 'C#', '3D Scan', 'Photon PUN2'],
      description: '研究室のチームで制作したマルチプレイ脱出ゲーム',
      detailedDescription: '研究室のメンバーとチーム開発で制作した2人協力型脱出ゲーム\nネットワーク機能の実装とゲームバランスの調整を担当。\n私の研究室は数年以内に閉鎖されるため、3Dスキャナーで空間をデジタル保存し、そのデータを使って脱出ゲームを制作しました。',
      features: ['チーム開発', 'マルチプレイ', '協力型謎解き', 'ネットワーク機能', '3Dスキャン'],
      image: `${process.env.PUBLIC_URL}/Image/MultiEscape.png`,
      links: {
        github: 'https://github.com/Taka100822/LabEscapeGame'
      }
    },
    {
      id: 3,
      title: 'DreamMayDay',
      category: '2D & HD2D Action',
      duration: '制作中',
      technology: ['Unity', 'C#'],
      description: 'BitSummitGameJam 2025にて制作中',
      detailedDescription: 'BitSummitGameJam 2025で現在制作中のプロジェクト\nプランナーとしてチームの進行管理&仕様書作成を担当しつつ、プログラマーとしてシステムの制御を実装。\n詳細は開発完了後に公開予定です。',
      features: ['チーム開発', 'BSGM2025', '球状モニター', '2画面',　'マルチプレイ'],
      image: 'https://via.placeholder.com/400x250/1a1a1a/f59e0b?text=DreamMayDay',
      links: {}
    },
    {
      id: 4,
      title: 'わけあい',
      category: '3D Action',
      duration: '1週間',
      technology: ['Unity', 'C#'],
      description: 'ハートを分け合って町を明るくするゲーム',
      detailedDescription: 'Unity1WeekGameJamの「あい」というテーマで制作した3Dアクションゲーム\nプレイヤーがハートを集めて町の人々に分け与えることで、暗い町を明るくしていくゲームです。限られた時間の中で企画・実装・調整まで一人で担当しました。',
      features: ['個人開発', 'Asset使用', 'Unity1WeekGameJam参加作品'],
      image: `${process.env.PUBLIC_URL}/Image/Wakeai.png`,
      links: {
        unityroom: 'https://unityroom.com/games/wakeai',
        github: 'https://github.com/Taka100822/Unity1WeekGameJam_1st'
      }
    },
    {
      id: 5,
      title: '研究用ゲーム',
      category: '2D Action',
      duration: '5ヶ月',
      technology: ['Unity', 'C#'],
      description: 'ゲームの視覚情報に関する研究のために作成した2Dアクションゲーム',
      detailedDescription: '卒業研究の一環として制作した2Dアクションゲーム\n視覚情報の多寡に関する研究データを収集するためのゲームで、プレイヤーの行動データを詳細に記録・分析できる仕組みを実装しました。遊ぶにはコントローラーが必要です。',
      features: ['Unity初作品', '研究用途', 'データ収集機能', 'TileMap'],
      image: `${process.env.PUBLIC_URL}/Image/ReserchGame.png`,
      links: {
        unityroom: 'https://unityroom.com/games/2d_actiongame',
        github: 'https://github.com/Taka100822/Graduation-Study'
      }
    },
    {
      id: 6,
      title: 'パズルゲーム',
      category: 'Puzzle',
      duration: '2週間',
      technology: ['Unity', 'C#'],
      description: 'パズドラのようなパズルゲーム（練習用として制作）',
      detailedDescription: 'パズル＆ドラゴンズのようなパズルゲームを練習として制作\nパズルのロジック実装やUI設計の技術向上を目的として開発しました。基本的なスコアシステムを実装しています。',
      features: ['パズルゲーム', '練習作品', 'UI設計', 'スコアシステム'],
      image: `${process.env.PUBLIC_URL}/Image/PazzleGame.png`,
      links: {
        unityroom: 'https://unityroom.com/games/pazlegame_practice'
      }
    },
    {
      id: 7,
      title: 'チャットアプリ',
      category: 'Web App',
      duration: '1週間',
      technology: ['HTML', 'JavaScript', 'Nuxt.js', 'Vuetify', 'Tailwind CSS' ,'Firebase'],
      description: 'インターンで制作したチャットWebアプリケーション',
      detailedDescription: 'Nuxt.jsを使用して制作したリアルタイムチャットアプリケーション\nフロントエンド開発の技術習得を目的として制作し、リアルタイム通信やユーザー管理機能を実装しました。',
      features: ['リアルタイムチャット', 'ログイン機能', 'データベースを活用したデータの保存'],
      image: `${process.env.PUBLIC_URL}/Image/chatApp.png`,
      links: {
        github: 'https://github.com/Taka100822/chat-app'
      }
    },
    {
      id: 8,
      title: '冷蔵庫管理アプリ',
      category: 'WebApp',
      duration: '3ヶ月',
      technology: ['Vue.js', 'Nuxt.js'],
      description: 'フロントエンドの一部分を担当したチーム開発プロジェクト',
      detailedDescription: 'チーム開発で制作した冷蔵庫の食材管理アプリケーション\n主にフロントエンドの実装を担当し、UI/UXの設計と実装に携わりました。チーム開発でのGit運用や役割分担の経験も積むことができました。',
      features: ['初チーム開発', 'フロントエンド担当', 'UI/UX設計'],
      image: `${process.env.PUBLIC_URL}/Image/fridge-manager.png`,
      links: {
        github: 'https://github.com/KIT-HI-ProgrammingContestGroupC/fridge-manager'
      }
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="works" className="section works-section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          Works
        </motion.h2>

        <motion.div
          className="works-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {works.map((work) => (
            <motion.div
              key={work.id}
              className="work-card card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedWork(work)}
            >
              <div className="work-image">
                <img src={work.image} alt={work.title} />
                <div className="work-overlay">
                  <button className="view-details">詳細を見る</button>
                </div>
              </div>

              <div className="work-content">
                <div className="work-meta">
                  <span className="work-category">{work.category}</span>
                  <span className="work-duration">{work.duration}</span>
                </div>

                <h3 className="work-title">{work.title}</h3>
                <div className="work-description">
                  {work.description.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < work.description.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>

                <div className="work-tech">
                  {work.technology.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="work-links">
                  {work.links.unityroom && (
                    <a href={work.links.unityroom} target="_blank" rel="noopener noreferrer" className="work-link">
                      <FaGamepad /> unityroom
                    </a>
                  )}
                  {work.links.github && (
                    <a href={work.links.github} target="_blank" rel="noopener noreferrer" className="work-link">
                      <FaGithub /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedWork && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setSelectedWork(null)}>×</button>
                
                <div className="modal-image">
                  <img src={selectedWork.image} alt={selectedWork.title} />
                </div>

                <div className="modal-info">
                  <h3 className="modal-title">{selectedWork.title}</h3>
                  <div className="modal-detailed-description">
                    {selectedWork.detailedDescription.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < selectedWork.detailedDescription.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>

                  <div className="modal-features">
                    <h4>主な機能・特徴</h4>
                    <ul>
                      {selectedWork.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-links">
                    {selectedWork.links.unityroom && (
                      <a href={selectedWork.links.unityroom} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <FaGamepad /> unityroomで遊ぶ
                      </a>
                    )}
                    {selectedWork.links.github && (
                      <a href={selectedWork.links.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <FaGithub /> GitHubで見る
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Works;