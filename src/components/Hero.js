import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Hero.css';

const Hero = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" ref={ref}>
      <div className="hero-background">
        <div className="hero-gradient"></div>
      </div>
      
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="title-line">Taka’s</span>
            <span className="title-line gradient-text">Portfolio</span>
            <span className="title-line">Site</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={itemVariants}>
            ゲームとWebアプリでユーザに響く体験をつくる<br />
            27卒プランナー・プロダクトマネージャー志望の<br />
            ポートフォリオへようこそ！！
          </motion.p>

          {/* <motion.div className="hero-stats" variants={itemVariants}>
            <div className="stat-item">
              <span className="stat-number gradient-text">5+</span>
              <span className="stat-label">Unity Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number gradient-text">2+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number gradient-text">100%</span>
              <span className="stat-label">Passion</span>
            </div>
          </motion.div> */}

          {/* <motion.div className="hero-actions" variants={itemVariants}>
            <button className="btn-primary" onClick={scrollToAbout}>
              About Me
            </button>
            <button className="btn-secondary" onClick={() => window.open('#contact', '_self')}>
              Contact
            </button>
          </motion.div> */}
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="visual-element">
            <div className="floating-card card-1">
              <span>Game Design</span>
            </div>
            <div className="floating-card card-2">
              <span>Planning</span>
            </div>
            <div className="floating-card card-3">
              <span>Teamwork</span>
            </div>
            <div className="floating-card card-4">
              <span>Web App</span>
            </div>
            <div className="floating-card card-5">
              <span>User Experience</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="scroll-arrow"></div>
      </motion.div>
    </section>
  );
};

export default Hero;