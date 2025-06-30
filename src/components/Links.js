import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStickyNote, FaGithub, FaBook, FaGamepad, FaExternalLinkAlt } from 'react-icons/fa';
import './Links.css';

const Links = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const links = [
    {
      title: 'GitHub',
      description: '制作物のソースコードを公開しています',
      url: 'https://github.com/Taka100822',
      icon: FaGithub,
      color: '#333333'
    },
    {
      title: 'unityroom',
      description: '制作したゲームを公開・配信しているプラットフォーム',
      url: 'https://unityroom.com/users/taka_unityroom',
      icon: FaGamepad,
      color: '#e60012'
    },
    {
      title: 'note',
      description: 'ゲーム開発の記録や読んだ書籍に関する記事などを投稿しています',
      url: 'https://note.com/Taka10822',
      icon: FaStickyNote,
      color: '#41c9b4'
    },
    {
      title: 'Qiita',
      description: 'Unity開発に関する技術記事・開発Tips',
      url: 'https://qiita.com/Taka10822',
      icon: FaBook,
      color: '#55c500'
    },
  ];

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.15
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
    <section id="links" className="section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          External Links
        </motion.h2>

        <motion.div
          className="links-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {links.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card card"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="link-header">
                <div className="link-icon" style={{ color: link.color }}>
                  <link.icon />
                </div>
                <div className="link-external">
                  <FaExternalLinkAlt />
                </div>
              </div>

              <div className="link-content">
                <h3 className="link-title">{link.title}</h3>
                <p className="link-description">{link.description}</p>
                
              </div>

              <div className="link-glow" style={{ 
                background: `radial-gradient(circle at center, ${link.color}15 0%, transparent 70%)` 
              }}></div>

              <div className="link-border" style={{ borderColor: link.color }}></div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="links-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="cta-text">
            各プラットフォームで情報発信・作品公開を行っています。<br />
            ぜひフォローして最新の活動をチェックしてください！
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Links;