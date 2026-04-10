import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaGamepad, FaPenFancy, FaSteam, FaGlobe, FaYoutube, FaDesktop, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer, titleMotionProps } from '../constants/animations';
import { worksData } from '../constants/works';
import './Works.css';

const LINK_CONFIG = {
  unityroom: { icon: <FaDesktop />,         cardLabel: 'unityroom', modalLabel: 'unityroomで遊ぶ' },
  itch:      { icon: <FaGamepad />,         cardLabel: 'itch.io',   modalLabel: 'itch.ioで遊ぶ' },
  steam:     { icon: <FaSteam />,           cardLabel: 'Steam',     modalLabel: 'Steamで遊ぶ' },
  nintendo:  { icon: <SiNintendoswitch />,  cardLabel: 'Nintendo',  modalLabel: 'ニンテンドーeショップで見る' },
  website:   { icon: <FaGlobe />,           cardLabel: 'Website',   modalLabel: 'Webサイトを見る' },
  github:    { icon: <FaGithub />,          cardLabel: 'GitHub',    modalLabel: 'GitHubで見る' },
  pdf:       { icon: <FaExternalLinkAlt />, cardLabel: 'PDF',       modalLabel: 'PDFを見る' },
  note:      { icon: <FaPenFancy />,        cardLabel: 'note',      modalLabel: 'noteを見る' },
  Youtube:   { icon: <FaYoutube />,         cardLabel: 'YouTube',   modalLabel: 'YouTubeを見る' },
};

const WorkLinks = ({ links, variant = 'card' }) => (
  <>
    {Object.entries(LINK_CONFIG).map(([key, { icon, cardLabel, modalLabel }]) => {
      if (!links[key]) return null;
      const cls = variant === 'modal' ? 'btn-primary' : 'work-link';
      const label = variant === 'modal' ? modalLabel : cardLabel;
      return (
        <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer" className={cls} data-key={key}>
          {icon} {label}
        </a>
      );
    })}
  </>
);

const useGalleryImages = (baseImage) => {
  const [images, setImages] = useState([baseImage]);

  useEffect(() => {
    setImages([baseImage]);
    const match = baseImage.match(/^(.+)(\.[^.]+)$/);
    if (!match) return;
    const [, base, ext] = match;
    let cancelled = false;

    const tryLoad = (n) => {
      if (cancelled) return;
      const src = `${base}${n}${ext}`;
      const img = new Image();
      img.onload = () => {
        if (!cancelled) {
          setImages(prev => [...prev, src]);
          tryLoad(n + 1);
        }
      };
      img.src = src;
    };
    tryLoad(2);
    return () => { cancelled = true; };
  }, [baseImage]);

  return images;
};

const ModalGallery = ({ work }) => {
  const allImages = useGalleryImages(work.image);
  const [index, setIndex] = useState(0);

  useEffect(() => { setIndex(0); }, [work]);

  const hasMultiple = allImages.length > 1;

  return (
    <div className="modal-gallery">
      <div className="modal-gallery-main">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={allImages[index]}
            alt={`${work.title} ${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
        {hasMultiple && (
          <>
            <button
              className="gallery-arrow gallery-prev"
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <FaChevronLeft />
            </button>
            <button
              className="gallery-arrow gallery-next"
              onClick={() => setIndex(i => Math.min(allImages.length - 1, i + 1))}
              disabled={index === allImages.length - 1}
            >
              <FaChevronRight />
            </button>
            <div className="gallery-counter">{index + 1} / {allImages.length}</div>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="modal-gallery-thumbs">
          {allImages.map((img, i) => (
            <button
              key={i}
              className={`gallery-thumb ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <img src={img} alt={`${work.title} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
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

                <ModalGallery work={selectedWork} />

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
