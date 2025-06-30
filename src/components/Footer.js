import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <span className="logo-text gradient-text">Taka’s Portfolio</span>
            </div>
            <p className="footer-description">
              ゲーム業界でプランナー、Web業界でプロダクトマネージャーを目指し、日々成長中です。
            </p>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="link-group">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#works">Works</a></li>
                <li><a href="#timeline">Timeline</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>External</h4>
              <ul>
                <li><a href="https://note.com/Taka10822" target="_blank" rel="noopener noreferrer">note</a></li>
                <li><a href="https://github.com/Taka100822" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://qiita.com/Taka10822" target="_blank" rel="noopener noreferrer">Qiita</a></li>
                <li><a href="https://unityroom.com/users/Taka_unityroom" target="_blank" rel="noopener noreferrer">unityroom</a></li>
              </ul>
            </div>
          </motion.div>

          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="copyright">
            © 2025 Taka’s Portfolio. Made with{' '}
            <FaHeart className="heart-icon" /> by Taka10
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;