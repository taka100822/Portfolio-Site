import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaGamepad, FaPenFancy, FaSteam, FaGlobe, FaYoutube, FaDesktop } from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer, titleMotionProps } from '../constants/animations';
import { worksData } from '../constants/works';
import './Works.css';

const WorkLinks = ({ links, variant = 'card' }) => {
  const isPrimary = (key) => ['unityroom', 'itch', 'steam', 'nintendo'].includes(key);
  const linkConfig = {
    unityroom: { icon: <FaDesktop />, label: variant === 'card' ? 'unityroom'      : 'unityroomで遊ぶ' },
    itch:      { icon: <FaGamepad />, label: variant === 'card' ? 'itch.io'        : 'itch.ioで遊ぶ' },
    steam:     { icon: <FaSteam />,   label: variant === 'card' ? 'Steam'          : 'Steamで遊ぶ' },
    nintendo:  { icon: <SiNintendoswitch />, label: variant === 'card' ? 'Nintendo'     : 'ニンテンドーeショップで見る' },
    website:   { icon: <FaGlobe />,   label: variant === 'card' ? 'Website'        : 'Webサイトを見る' },
    github:    { icon: <FaGithub />,  label: variant === 'card' ? 'GitHub'         : 'GitHubで見る' },
    pdf:       { icon: <FaExternalLinkAlt />, label: variant === 'card' ? 'PDF'   : 'PDFを見る' },
    note:      { icon: <FaPenFancy />, label: variant === 'card' ? 'note'          : 'noteを見る' },
    Youtube:   { icon: <FaYoutube />,         label: variant === 'card' ? 'YouTube'      : 'YouTubeを見る' },
  };

  return (
    <>
      {Object.entries(linkConfig).map(([key, { icon, label }]) => {
        if (!links[key]) return null;
        const cls = variant === 'modal'
          ? (isPrimary(key) ? 'btn-primary' : 'btn-secondary')
          : 'work-link';
        return (
          <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer" className={cls} data-key={key}>
            {icon} {label}
          </a>
        );
      })}
    </>
  );
};

const Works = () => {
  const [ref, inView] = useScrollAnimation();
  const [selectedWork, setSelectedWork] = useState(null);

  return (
    <section id="works" className="section works-section" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title" {...titleMotionProps(inView)}>
          Works
        </motion.h2>

        <motion.div
          className="works-grid"
          variants={staggerContainer(0.2)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {worksData.map((work, index) => (
            <motion.div
              key={work.id}
              className="work-card"
              variants={fadeUpVariants}
              onClick={() => setSelectedWork(work)}
            >
              <span className="work-number">{String(index + 1).padStart(2, '0')}</span>
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
                <p className="work-description">{work.description}</p>
                <div className="work-tech">
                  {work.technology.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="work-links">
                  <WorkLinks links={work.links} variant="card" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
                  <div className="modal-meta">
                    <span className="modal-category">{selectedWork.category}</span>
                    <span className="modal-duration">{selectedWork.duration}</span>
                  </div>

                  <div className="modal-divider" />
                  <p className="modal-detailed-description">
                    {selectedWork.detailedDescription.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </p>

                  <div className="modal-divider" />
                  <div className="modal-features">
                    <h4>特徴 / キーワード</h4>
                    <ul>
                      {selectedWork.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>

                  <div className="modal-divider" />
                  <div className="modal-links">
                    <WorkLinks links={selectedWork.links} variant="modal" />
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
