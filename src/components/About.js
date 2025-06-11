import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section id="about" className="section about-section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
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
              <h3 className="gradient-text">
                {'簡単な自己紹介'.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < '簡単な自己紹介'.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <p>
                大学院で情報工学を学びながら、ゲーム会社でプランナー兼プログラマーとしてアルバイトをしています。  
                特にUnityを使ってユニークなゲームプレイ体験を創ることに情熱を注いでいます。
                また、ゲームのインタラクションに関する研究やWebアプリ開発にも力を入れています。
                27卒として就職活動中です。
              </p>
            </div>

            <div className="text-block">
              <h3 className="gradient-text">
                {'これまでの経験'.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < 'これまでの経験'.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <p>
                個人でUnity & C#のゲームを開発するところから始まり、チームでの進行管理や、
                企業でのアルバイト・インターンを通して、実際の現場でも企画を形にしてきました。
                また、学会発表に参加するなど研究にも注力しています。
              </p>
            </div>

            <div className="text-block">
              <h3 className="gradient-text">
                {'目指すビジョン'.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < '目指すビジョン'.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <p>
                私は、ゲームやWebアプリを通じて、
                ユーザの心を動かす「感動」を届けたいと考えています。
                そのために、クリエイティブな発想力を活かして、
                多くの人に愛されるコンテンツ企画・開発に取り組んでいきたいです。
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
                  <h4>感動を生む体験設計</h4>
                  <p>　</p>
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
                  <div className="stat-number gradient-text">1.5+</div>
                  <div className="stat-label">年の経験</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number gradient-text">10+</div>
                  <div className="stat-label">制作物</div>
                </div>
              </motion.div>

              <motion.div 
                className="passion-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <div className="passion-item">
                  <div className="passion-label">趣味</div>
                  <div className="passion-tags">
                    <span className="passion-tag">ピアノ</span>
                    <span className="passion-tag">バイク</span>
                    <span className="passion-tag">バスケ</span>
                    <span className="passion-tag">読書</span>
                  </div>
                </div>
                {/* <div className="passion-item">
                  <div className="passion-label">好きな言葉</div>
                  <div className="passion-tags">
                    <span className="passion-tag">有言実行</span>
                    <span className="passion-tag">日々成長</span>
                    <span className="passion-tag">結束は無限の力を生む</span>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;