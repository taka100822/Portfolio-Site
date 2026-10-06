import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaGamepad, FaPenFancy, FaSteam, FaGlobe, FaYoutube, FaDesktop, FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';
import { worksData, workOrder } from '../constants/works';
import { useLang } from '../i18n';
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

const WorkLinks = ({ links, variant = 'card' }) => {
  const { t } = useLang();

  return (
    <>
      {Object.entries(LINK_CONFIG).map(([key, { icon, cardLabel, modalLabel }]) => {
        if (!links[key]) return null;
        const base = variant === 'modal' ? 'modal-link' : 'work-link';
        const cls = PLAY_KEYS.includes(key) ? `${base} is-play` : base;
        const label = variant === 'modal' ? t(modalLabel) : cardLabel;
        return (
          <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer" className={cls} data-key={key}>
            {icon} {label}
          </a>
        );
      })}
    </>
  );
};

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

const ModalGallery = ({ work, expand, fade }) => {
  const allImages = useGalleryImages(work.image);
  const youtubeId = getYouTubeId(work.links.Youtube);
  const { t } = useLang();

  // 動画があれば先頭に置き、そのあとに画像を並べる
  const offset = youtubeId ? 1 : 0;
  const items = [
    ...(youtubeId ? [{ type: 'youtube', id: youtubeId }] : []),
    ...allImages.map(src => ({ type: 'image', src })),
  ];

  // カードから開いたときはサムネと同じ画像のまま広がり、広がりきったら動画に切り替える。
  // それまでに自分で画像を選んだら、切り替えない
  const [index, setIndex] = useState(expand ? offset : 0);
  const [playing, setPlaying] = useState(false); // 押すまで YouTube は読み込まない
  const touched = useRef(false);
  useEffect(() => {
    touched.current = false;
    setPlaying(false);
    if (!expand || !youtubeId) {
      setIndex(0);
      return undefined;
    }
    setIndex(1);
    const timer = setTimeout(() => { if (!touched.current) setIndex(0); }, 700);
    return () => clearTimeout(timer);
  }, [work, youtubeId, expand]);

  const go = (next) => {
    touched.current = true;
    setPlaying(false);
    setIndex(next);
  };

  const hasMultiple = items.length > 1;
  const current = items[index] || items[0];
  const imageLabel = (i) => `${t('画像')} ${i - offset + 1}`;

  return (
    <div className="modal-gallery">
      <motion.div
        className="modal-gallery-main"
        layoutId={expand ? `work-thumb-${work.id}` : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          {current.type === 'youtube' ? (
            <motion.div
              key="youtube"
              className="gallery-youtube"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
                  title={`${t(work.title)} ${t('プレイ動画')}`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <button className="gallery-poster" onClick={() => setPlaying(true)}>
                  <img src={`https://img.youtube.com/vi/${current.id}/hqdefault.jpg`} alt="" />
                  <span className="gallery-poster-play" aria-hidden="true"><FaPlay /></span>
                  <span className="gallery-poster-label">{t('プレイ動画を再生')}</span>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.img
              key={current.src}
              src={current.src}
              alt={t(work.title)}
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
              aria-label={t('前へ')}
              onClick={() => go(Math.max(0, index - 1))}
              disabled={index === 0}
            >
              <FaChevronLeft />
            </button>
            <button
              className="gallery-arrow gallery-next"
              aria-label={t('次へ')}
              onClick={() => go(Math.min(items.length - 1, index + 1))}
              disabled={index === items.length - 1}
            >
              <FaChevronRight />
            </button>
            <div className="gallery-counter">
              {current.type === 'youtube' ? t('プレイ動画') : `${index - offset + 1} / ${allImages.length}`}
            </div>
          </>
        )}
      </motion.div>
      {hasMultiple && (
        <motion.div className="modal-gallery-thumbs" {...fade}>
          {items.map((item, i) => (
            <button
              key={i}
              className={`gallery-thumb ${i === index ? 'active' : ''}`}
              aria-label={item.type === 'youtube' ? t('プレイ動画') : imageLabel(i)}
              onClick={() => go(i)}
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
                <img src={item.src} alt={`${t(work.title)} ${imageLabel(i)}`} />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const splitLines = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);

const orderOf = (id) => (workOrder.includes(id) ? workOrder.indexOf(id) : workOrder.length);
const allWorks = [...worksData].sort((a, b) => orderOf(a.id) - orderOf(b.id));

// 全作品をサムネ付きのカードで並べる
const WorkGrid = ({ onOpen, openId }) => {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

  return (
    <ul className="works-list">
      {allWorks.map((work, i) => (
        <motion.li
          key={work.id}
          className={`work-card ${openId === work.id ? 'is-open' : ''}`}
          layoutId={reduceMotion ? undefined : `work-card-${work.id}`}
          onClick={() => onOpen(work)}
        >
          <motion.div
            className="work-thumb"
            layoutId={reduceMotion ? undefined : `work-thumb-${work.id}`}
          >
            <img src={work.image} alt="" loading="lazy" />
            {getYouTubeId(work.links.Youtube) && (
              <span className="work-thumb-video">
                <FaPlay aria-hidden="true" />
                <span>{t('動画あり')}</span>
              </span>
            )}
            <span className="work-thumb-cta" aria-hidden="true">{t('詳しく見る')} →</span>
          </motion.div>
          <div className="work-body">
            <p className="work-index">
              <span className="work-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-genre">{work.category}</span>
            </p>
            <button
              className="work-title"
              onClick={(e) => { e.stopPropagation(); onOpen(work); }}
            >
              {t(work.title)}
            </button>
            <p className="work-desc">{t(work.description)}</p>
            <div className="work-foot">
              <p className="work-meta">{t('制作期間')} {t(work.duration)}</p>
              <div className="work-links" onClick={(e) => e.stopPropagation()}>
                <WorkLinks links={work.links} variant="card" />
              </div>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

const Works = ({ selectedWork, onSelectWork: setSelectedWork }) => {
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  // 一覧のカードから開いたときだけ、そのカードが大きくなるように見せる
  // （Hero から開いたときはカードが画面外にあるので、中央で拡大する）
  const [expandFrom, setExpandFrom] = useState(null);
  const expand = !reduceMotion && selectedWork && expandFrom === selectedWork.id;
  // 拡大のあいだ文字が伸び縮みして見えないよう、本文は広がりきってから出す
  const fade = expand ? {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, delay: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  } : {};
  const openFromGrid = (work) => {
    setExpandFrom(work.id);
    setSelectedWork(work);
  };

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

        <WorkGrid onOpen={openFromGrid} openId={expand ? selectedWork.id : null} />

        <AnimatePresence onExitComplete={() => setExpandFrom(null)}>
          {selectedWork && (
            <motion.div
              key="backdrop"
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            />
          )}
          {selectedWork && (
            <div key="modal" className="modal-overlay" onClick={() => setSelectedWork(null)}>
              <motion.div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-label={t(selectedWork.title)}
                layoutId={expand ? `work-card-${selectedWork.id}` : undefined}
                initial={expand || reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={expand ? undefined : { opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div className="modal-scroll" layoutScroll>
                <motion.div className="modal-bar" {...fade}>
                  <span className="modal-bar-title">{t(selectedWork.title)}</span>
                  <button
                    ref={closeRef}
                    className="modal-close"
                    aria-label={t('閉じる')}
                    onClick={() => setSelectedWork(null)}
                  >
                    ×
                  </button>
                </motion.div>

                <ModalGallery work={selectedWork} expand={expand} fade={fade} />

                <motion.div className="modal-info" {...fade}>
                  <h3 className="modal-title">{t(selectedWork.title)}</h3>

                  {selectedWork.detailedDescription.overview && (
                    <p className="modal-lead">{nl(t(selectedWork.detailedDescription.overview))}</p>
                  )}

                  {/* 基本情報をひと目で読めるように横に並べる */}
                  <dl className="modal-facts">
                    <div>
                      <dt>{t('ジャンル')}</dt>
                      <dd>{selectedWork.category}</dd>
                    </div>
                    <div>
                      <dt>{t('制作期間')}</dt>
                      <dd>{t(selectedWork.duration)}</dd>
                    </div>
                    <div>
                      <dt>{t('使用技術')}</dt>
                      <dd>{selectedWork.technology.map(t).join(' / ')}</dd>
                    </div>
                  </dl>

                  <div className="modal-links">
                    <WorkLinks links={selectedWork.links} variant="modal" />
                  </div>

                  {/* 企画書のスペック表のように、左に見出し・右に内容 */}
                  {selectedWork.detailedDescription.content && (
                    <section className="modal-section">
                      <h4>{t('内容')}</h4>
                      <div className="modal-section-body">
                        {splitLines(t(selectedWork.detailedDescription.content)).map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedWork.detailedDescription.role && (
                    <section className="modal-section">
                      <h4>{t('担当')}</h4>
                      <ol className="modal-role modal-section-body">
                        {splitLines(t(selectedWork.detailedDescription.role)).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </section>
                  )}

                  <section className="modal-section">
                    <h4>{t('キーワード')}</h4>
                    <ul className="modal-keywords modal-section-body">
                      {selectedWork.features.map((f) => <li key={f}>{t(f)}</li>)}
                    </ul>
                  </section>
                </motion.div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Works;
