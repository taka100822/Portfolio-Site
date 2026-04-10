import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer, titleMotionProps } from '../constants/animations';
import { linksData } from '../constants/links';
import './Links.css';

const Links = () => {
  const [ref, inView] = useScrollAnimation();

  return (
    <section id="links" className="section" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title" {...titleMotionProps(inView)}>
          External Links
        </motion.h2>

        <motion.div
          className="links-grid"
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {linksData.map((link) => (
            <motion.a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card card"
              variants={fadeUpVariants}
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
              <div
                className="link-glow"
                style={{ background: `radial-gradient(circle at center, ${link.color}15 0%, transparent 70%)` }}
              />
              <div className="link-border" style={{ borderColor: link.color }} />
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
