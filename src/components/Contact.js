import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaTwitter } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          Contact
        </motion.h2>

        <motion.div
          className="contact-content"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="contact-info card">
            <div className="info-text">
              <h3 className="gradient-text">ご連絡について</h3>
              <p>
                ゲーム業界・Web業界での新卒採用に関するご相談や、
                ポートフォリオについてのご質問など、
                はXのDMでお受けしております。
              </p>
              <p>
                チーム開発への参加やインターンシップの機会なども
                積極的に検討させていただきますので、
                お気軽にお声がけください。
              </p>
            </div>

            <motion.a
              href="https://twitter.com/Taka10822GC"
              target="_blank"
              rel="noopener noreferrer"
              className="twitter-contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="twitter-icon">
                <FaTwitter />
              </div>
              <div className="twitter-info">
                <span className="twitter-label">X (Twitter) </span>
                <span className="twitter-value">@Taka10822GC</span>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;