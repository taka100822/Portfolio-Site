import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { titleMotionProps } from '../constants/animations';
import './About.css';

const About = () => {
  const [ref, inView] = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="about" className="section about-section" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title" {...titleMotionProps(inView)}>
          About Me
        </motion.h2>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-block">
              <div className="text-block-number">01 — Profile</div>
              <h3>簡単な自己紹介</h3>
              <p>
              京都にある<strong>大学院</strong>で<strong>ゲームのインタラクションに関する研究</strong>を行いながら、ゲーム制作に取り組んでいます。
              <strong>ゲーム制作団体「TOMSN」の代表</strong>としてチームを率い、第2弾タイトルの開発を進めています。
              </p>
            </div>

            <div className="text-block">
              <div className="text-block-number">02 — Experience</div>
              <h3>これまでの経験</h3>
              <p>
              個人でUnityを用いたゲーム開発からスタートし、<strong>ゲームジャムへの参加</strong>や
              <strong>「TOMSN」設立によるチーム開発・マネジメント</strong>を経験してきました。
              さらに、<strong>企業でのアルバイト・インターンシップ</strong>を通して、企画を実際の形にする経験を積んできました。
              また、<strong>学会発表</strong>に参加するなど研究活動にも注力しており、
              理論と実践の両面からゲームに向き合っています。
              加えて、<strong>タイへ短期留学</strong>を通じて、海外での経験を通して視野を広げました。
              </p>
            </div>

            <div className="text-block">
              <div className="text-block-number">03 — Vision</div>
              <h3>目指すビジョン</h3>
              <p>
              私は、ゲーム体験を通じて<strong>人々の心に残り続ける価値</strong>を届けたいと考えています。  
              プレイした瞬間の楽しさにとどまらず、「出会えてよかった」と思えるような、
              <strong>人生の中で意味を持つ体験</strong>を生み出したいです。
              これまで、ゲーム制作や研究活動を通じてプレイヤー体験の設計に向き合い、
              実際に人の感情を動かす経験を積んできました。
              今後は、体験の根幹を設計し、<strong>人々の記憶に残り続けるコンテンツ</strong>を創り続けていきます。
              </p>
            </div>
          </motion.div>

          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="passion-showcase">
              <motion.div 
                className="profile-image-container"
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <img src={`${process.env.PUBLIC_URL}/Image/me.jpeg`} alt="Profile" className="profile-image" />
              </motion.div>

              <motion.div
                className="passion-card main-card"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={inView ? { rotateY: 0, opacity: 1 } : { rotateY: 180, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              >
                <div className="card-inner">
                  <div className="card-icon">🎮</div>
                  <div>
                    <h4>コンテンツ設計</h4>
                    <p>ゲームプランナー（デザイナー）</p>
                  </div>
                  <div className="card-glow"></div>
                </div>
              </motion.div>

              <div className="mini-cards">
                <motion.div 
                  className="passion-card mini-card"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="mini-icon">💡</div>
                  <span>発想</span>
                </motion.div>

                <motion.div 
                  className="passion-card mini-card"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <div className="mini-icon">🔧</div>
                  <span>実装</span>
                </motion.div>

                <motion.div 
                  className="passion-card mini-card"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="mini-icon">❤️</div>
                  <span>情熱</span>
                </motion.div>
              </div>

              <motion.div 
                className="stats-grid"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <div className="stat-item">
                  <div className="stat-number gradient-text">2+</div>
                  <div className="stat-label">年の経験</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number gradient-text">9</div>
                  <div className="stat-label">制作物</div>
                </div>
              </motion.div>

              <motion.div
                className="hobby-photos"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <div className="hobby-photos-label">趣味</div>
                <div className="hobby-photos-grid">
                  {[
                    { src: 'hobby/hobby-piano.jpg',   emoji: '🎹', label: 'ピアノ' },
                    { src: 'hobby/hobby-bike.jpg',    emoji: '🏍️', label: 'バイク' },
                    { src: 'hobby/hobby-basket.jpg',  emoji: '🏀', label: 'バスケ' },
                    { src: 'hobby/hobby-travel.jpg',  emoji: '✈️', label: '旅行'   },
                  ].map(({ src, emoji, label }) => (
                    <div className="hobby-photo-item" key={label}>
                      <div className="hobby-photo-frame">
                        <img
                          src={`${process.env.PUBLIC_URL}/Image/${src}`}
                          alt={label}
                          className="hobby-photo-img"
                          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                        />
                        <div className="hobby-photo-placeholder" style={{ display: 'none' }}>
                          <span>{emoji}</span>
                        </div>
                      </div>
                      <span className="hobby-photo-label">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;