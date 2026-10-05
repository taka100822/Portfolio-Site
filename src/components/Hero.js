import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer } from '../constants/animations';
import './Hero.css';

const Hero = () => {
  const [ref, inView] = useScrollAnimation();

  return (
    <section className="hero" ref={ref}>
      <div className="hero-background">
        <div className="hero-gradient" />
      </div>

      <div className="container">
        <motion.div
          className="hero-content"
          variants={staggerContainer(0.3)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.h1 className="hero-title" variants={fadeUpVariants}>
            <span className="title-line">Taka10's</span>
            <span className="title-line gradient-text">Portfolio</span>
            <span className="title-line">Site</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUpVariants}>
            人々の記憶に残り続けるコンテンツを創る<br />
            27卒ゲームプランナーの<br />
            ポートフォリオへようこそ！！
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="scroll-arrow" />
      </motion.div>
    </section>
  );
};

export default Hero;
