import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

// 遊べる・買えるリンクは目立たせる
const PLAY_KEYS = ['itch', 'unityroom', 'steam', 'nintendo'];

const WorkLinks = ({ links, variant = 'card' }) => (
  <>
    {Object.entries(LINK_CONFIG).map(([key, { icon, cardLabel, modalLabel }]) => {
      if (!links[key]) return null;
      const base = variant === 'modal' ? 'modal-link' : 'work-link';
      const cls = PLAY_KEYS.includes(key) ? `${base} is-play` : base;
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
              aria-label="前へ"
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <FaChevronLeft />
            </button>
            <button
              className="gallery-arrow gallery-next"
              aria-label="次へ"
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
              aria-label={item.type === 'youtube' ? '動画' : `画像 ${i + 1}`}
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
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // 開いたら閉じるボタンにフォーカスし、Esc で閉じる。閉じたら元の場所へフォーカスを戻す
  useEffect(() => {
    if (!selectedWork) return undefined;
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setSelectedWork(null); };
    document.addEventListener('keydown', onKey);
    // 開いている間は背面のページをスクロールさせない
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
  }, [selectedWork, setSelectedWork]);

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
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-label={selectedWork.title}
                initial={reduceMotion ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-bar">
                  <span className="modal-bar-category">{selectedWork.category}</span>
                  <button
                    ref={closeRef}
                    className="modal-close"
                    aria-label="閉じる"
                    onClick={() => setSelectedWork(null)}
                  >
                    ×
                  </button>
                </div>

                <ModalGallery work={selectedWork} />

                <div className="modal-info">
                  {selectedWork.achievement && (
                    <p className="modal-achievement">{selectedWork.achievement}</p>
                  )}
                  <h3 className="modal-title">{selectedWork.title}</h3>
                  <p className="modal-duration">制作期間：{selectedWork.duration}</p>

                  {selectedWork.detailedDescription.overview && (
                    <p className="modal-lead">{nl(selectedWork.detailedDescription.overview)}</p>
                  )}

                  <div className="modal-links">
                    <WorkLinks links={selectedWork.links} variant="modal" />
                  </div>

                  {selectedWork.detailedDescription.content && (
                    <section className="modal-section">
                      <h4>内容</h4>
                      <p>{nl(selectedWork.detailedDescription.content)}</p>
                    </section>
                  )}

                  {selectedWork.detailedDescription.role && (
                    <section className="modal-section">
                      <h4>担当</h4>
                      <ul className="modal-role">
                        {splitLines(selectedWork.detailedDescription.role).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="modal-section">
                    <h4>使用技術</h4>
                    <div className="work-tech">
                      {selectedWork.technology.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  </section>

                  <section className="modal-section">
                    <h4>キーワード</h4>
                    <ul className="modal-keywords">
                      {selectedWork.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </section>
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
