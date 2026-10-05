import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaGamepad, FaPenFancy, FaSteam, FaGlobe, FaYoutube, FaDesktop, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';
import { worksData, workGroups } from '../constants/works';
import FeaturedImage from './FeaturedImage';
import './Works.css';

const nl = (text) => text.split('\n').map((line, i, arr) => (
  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
));

const LINK_CONFIG = {
  unityroom: { icon: <FaDesktop />,         cardLabel: 'unityroom', modalLabel: 'unityroomで遊ぶ' },
  itch:      { icon: <FaGamepad />,         cardLabel: 'itch.io',   modalLabel: 'itch.ioで遊ぶ' },
  steam:     { icon: <FaSteam />,           cardLabel: 'Steam',     modalLabel: 'Steamで遊ぶ' },
  nintendo:  { icon: <SiNintendoswitch />,  cardLabel: 'Nintendo',  modalLabel: 'ニンテンドーeショップで見る' },
  note:      { icon: <FaPenFancy />,        cardLabel: 'note',      modalLabel: 'noteを見る' },
  Youtube:   { icon: <FaYoutube />,         cardLabel: 'YouTube',   modalLabel: 'YouTubeを見る' },
  website:   { icon: <FaGlobe />,           cardLabel: 'Website',   modalLabel: 'Webサイトを見る' },
  github:    { icon: <FaGithub />,          cardLabel: 'GitHub',    modalLabel: 'GitHubで見る' },
  pdf:       { icon: <FaExternalLinkAlt />, cardLabel: 'PDF',       modalLabel: 'PDFを見る' },
};

const BLUE_KEYS   = ['note'];
const ORANGE_KEYS = ['itch', 'unityroom', 'steam', 'nintendo'];

const WorkLinks = ({ links, variant = 'card' }) => (
  <>
    {Object.entries(LINK_CONFIG).map(([key, { icon, cardLabel, modalLabel }]) => {
      if (!links[key]) return null;
      const cls = variant === 'modal'
        ? (BLUE_KEYS.includes(key) ? 'btn-primary' : ORANGE_KEYS.includes(key) ? 'btn-white' : 'btn-secondary')
        : 'work-link';
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

    const ALT_EXTS = [ext, ...['.png', '.jpg', '.jpeg'].filter(e => e !== ext)];

    const tryExts = (n, exts) => {
      if (cancelled || exts.length === 0) return;
      const [first, ...rest] = exts;
      const src = `${base}${n}${first}`;
      const img = new Image();
      img.onload = () => {
        if (!cancelled) {
          setImages(prev => [...prev, src]);
          tryExts(n + 1, ALT_EXTS);
        }
      };
      img.onerror = () => { if (!cancelled) tryExts(n, rest); };
      img.src = src;
    };
    tryExts(2, ALT_EXTS);
    return () => { cancelled = true; };
  }, [baseImage]);

  return images;
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/youtu\.be\/([^?&]+)/) || url.match(/[?&]v=([^&]+)/);
  return m ? m[1] : null;
};

const ModalGallery = ({ work }) => {
  const allImages = useGalleryImages(work.image);
  const youtubeId = getYouTubeId(work.links.Youtube);

  // items: youtube first (if exists), then images
  const items = [
    ...(youtubeId ? [{ type: 'youtube', id: youtubeId }] : []),
    ...allImages.map(src => ({ type: 'image', src })),
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [work]);

  const hasMultiple = items.length > 1;
  const current = items[index];

  return (
    <div className="modal-gallery">
      <div className="modal-gallery-main">
        <AnimatePresence mode="wait">
          {current.type === 'youtube' ? (
            <motion.div
              key="youtube"
              className="gallery-youtube"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${current.id}`}
                title="YouTube"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </motion.div>
          ) : (
            <motion.img
              key={current.src}
              src={current.src}
              alt={`${work.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
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
              onClick={() => setIndex(i => Math.min(items.length - 1, i + 1))}
              disabled={index === items.length - 1}
            >
              <FaChevronRight />
            </button>
            <div className="gallery-counter">{index + 1} / {items.length}</div>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="modal-gallery-thumbs">
          {items.map((item, i) => (
            <button
              key={i}
              className={`gallery-thumb ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              {item.type === 'youtube' ? (
                <div className="gallery-thumb-youtube">
                  <img
                    src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
                    alt="YouTube"
                  />
                  <div className="gallery-thumb-play">▶</div>
                </div>
              ) : (
                <img src={item.src} alt={`${work.title} ${i + 1}`} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const splitLines = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);

const FeaturedWork = ({ work, onOpen }) => (
  <article className="featured-work">
    <FeaturedImage work={work} onOpen={onOpen} />

    <div className="featured-body">
      {work.achievement && <p className="featured-achievement">{work.achievement}</p>}
      <h3 className="featured-title">{work.title}</h3>
      <p className="featured-overview">{work.detailedDescription.overview}</p>

      <div className="featured-role">
        <h4>担当</h4>
        <ul>
          {splitLines(work.detailedDescription.role).map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>

      <div className="work-tech">
        {work.technology.map((tech) => <span key={tech} className="tech-tag">{tech}</span>)}
      </div>

      <div className="featured-actions">
        <button className="featured-open" onClick={onOpen}>詳細を見る</button>
        <div className="work-links">
          <WorkLinks links={work.links} variant="card" />
        </div>
      </div>
    </div>
  </article>
);

const featuredWorks = worksData.filter((w) => w.featured);
const groupedWorks = workGroups.map((g) => ({
  ...g,
  works: g.ids.map((id) => worksData.find((w) => w.id === id)).filter(Boolean),
}));

// 代表作以外を分類ごとの一覧で。PC では右側に、ホバー中の作品の画像を出す
const OtherWorks = ({ onOpen }) => {
  const [preview, setPreview] = useState(groupedWorks[0].works[0]);

  return (
    <div className="other-works">
      <div className="other-list">
        {groupedWorks.map((group) => (
          <section key={group.label} className="other-group">
            <h4 className="other-group-label">{group.label}</h4>
            <ul>
              {group.works.map((work) => (
                <li
                  key={work.id}
                  className={`other-row ${preview.id === work.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setPreview(work)}
                  onClick={() => onOpen(work)}
                >
                  <img className="other-thumb" src={work.image} alt="" loading="lazy" />
                  <div className="other-main">
                    <button
                      className="other-title"
                      onFocus={() => setPreview(work)}
                      onClick={(e) => { e.stopPropagation(); onOpen(work); }}
                    >
                      {work.title}
                    </button>
                    <p className="other-desc">{work.description}</p>
                  </div>
                  <span className="other-meta">
                    {work.category}
                    <br />
                    {work.duration}
                  </span>
                  <div className="work-links" onClick={(e) => e.stopPropagation()}>
                    <WorkLinks links={work.links} variant="card" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="other-preview" aria-hidden="true">
        <div className="other-preview-frame">
          <img key={preview.id} src={preview.image} alt="" />
        </div>
        <p className="other-preview-title">{preview.title}</p>
      </div>
    </div>
  );
};

const Works = ({ selectedWork, onSelectWork: setSelectedWork }) => {
  return (
    <section id="works" className="section works-section">
      <div className="container">
        <h2 className="section-title">Works</h2>

        <div className="featured-list">
          {featuredWorks.map((work) => (
            <FeaturedWork key={work.id} work={work} onOpen={() => setSelectedWork(work)} />
          ))}
        </div>

        <h3 className="works-subheading">そのほかの制作</h3>

        <OtherWorks onOpen={setSelectedWork} />

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
                  <div className="modal-detailed-description">
                    {selectedWork.detailedDescription.overview && (
                      <p className="modal-desc-intro">{nl(selectedWork.detailedDescription.overview)}</p>
                    )}
                    {selectedWork.detailedDescription.content && (
                      <div className="modal-desc-section">
                        <span className="modal-desc-label">内容</span>
                        <p>{nl(selectedWork.detailedDescription.content)}</p>
                      </div>
                    )}
                    {selectedWork.detailedDescription.role && (
                      <div className="modal-desc-section">
                        <span className="modal-desc-label">担当箇所</span>
                        <ul className="modal-desc-role">
                          {selectedWork.detailedDescription.role.split('\n').map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="modal-divider" />
                  <div className="modal-features">
                    <h4>使用技術</h4>
                    <div className="work-tech" style={{marginBottom: '0.75rem'}}>
                      {selectedWork.technology.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
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
