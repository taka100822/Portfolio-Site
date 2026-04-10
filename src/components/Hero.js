import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaFlask, FaUsers, FaGlobe, FaHeart, FaCrown } from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer } from '../constants/animations';
import './Hero.css';

const FLOATING_CARDS = [
  { className: 'card-1', Icon: FaGamepad, label: 'Game Creation' },
  { className: 'card-2', Icon: FaFlask,   label: 'Research' },
  { className: 'card-3', Icon: FaUsers,   label: 'Teamwork' },
  { className: 'card-4', Icon: FaGlobe,   label: 'Cross-cultural' },
  { className: 'card-5', Icon: FaHeart,   label: 'User Experience' },
  { className: 'card-6', Icon: FaCrown,   label: 'Leadership' },
];

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
            ゲームを通じてユーザの心に響く体験をつくる<br />
            27卒ゲームプランナー志望の<br />
            ポートフォリオへようこそ！！
          </motion.p>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="visual-element">
            {FLOATING_CARDS.map(({ className, Icon, label }) => (
              <div key={label} className={`floating-card ${className}`}>
                <Icon className="fc-icon" />
                <span>{label}</span>
              </div>
            ))}
          </div>
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
