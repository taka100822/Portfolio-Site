import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaBookOpen, FaChevronDown, FaGamepad, FaRunning, FaTools, FaTrophy } from 'react-icons/fa';
import { timelineByChapter, getTypeLabel } from '../constants/timeline';
import './Timeline.css';

const TOAST_MS = 3200;
const ACHIEVE_DWELL_MS = 500;

const TYPE_ICON = {
  game:       FaGamepad,
  project:    FaTools,
  education:  FaBookOpen,
  experience: FaRunning,
};

// 普段はタイトルだけ。行を押すと説明・タグ・note が開く
const TimelineItem = ({ item, index, onAchieve }) => {
  const [ref, inView] = useInView({ threshold: 0.6, skip: !item.achievement });
  const [open, setOpen] = useState(false);
  const panelId = `timeline-${item.year}-${item.month}-${index}`;
  const TypeIcon = TYPE_ICON[item.type];

  // ナビでの移動などで通り過ぎただけでは出さず、しばらく画面に留まったら出す
  useEffect(() => {
    if (!inView || !item.achievement) return undefined;
    const timer = setTimeout(() => onAchieve(item.achievement), ACHIEVE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [inView, item.achievement, onAchieve]);

  return (
    <li ref={ref} className={`timeline-item ${item.achievement ? 'is-achievement' : ''} ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="timeline-row"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <time className="timeline-date" dateTime={`${item.year}-${item.month}`}>
          {item.year}.{item.month}
        </time>
        <span className={`timeline-type type-${item.type}`}>
          {TypeIcon && <TypeIcon className="timeline-type-icon" aria-hidden="true" />}
          {getTypeLabel(item.type)}
        </span>
        <span className="timeline-title">
          {item.achievement && <FaTrophy className="timeline-trophy" aria-label="受賞・発表" />}
          {item.title}
        </span>
        <FaChevronDown className="timeline-chevron" aria-hidden="true" />
      </button>

      <div className="timeline-panel" id={panelId}>
        <div className="timeline-panel-inner">
          <p className="timeline-description">{item.description}</p>
          <div className="timeline-tags">
            {item.details.map((detail) => <span key={detail}>{detail}</span>)}
          </div>
          {item.noteLink && (
            <a href={item.noteLink} target="_blank" rel="noopener noreferrer" className="timeline-note">
              noteで詳しく読む<span aria-hidden="true"> ↗</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

// 受賞・発表の行が画面に入ったら、ゲームの実績解除風に1件ずつ知らせる
const AchievementToast = ({ queue, onDone }) => {
  const current = queue[0];

  useEffect(() => {
    if (!current) return undefined;
    const timer = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(timer);
  }, [current, onDone]);

  return (
    <div className="achievement-region" role="status" aria-live="polite">
      {current && (
        <div className="achievement-toast" key={current}>
          <FaTrophy className="achievement-icon" aria-hidden="true" />
          <div>
            <span className="achievement-label">実績解除</span>
            <span className="achievement-text">{current}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Timeline = () => {
  const [queue, setQueue] = useState([]);
  const unlockedRef = useRef(new Set());

  // 実績は1つにつき1回だけ
  const handleAchieve = useCallback((text) => {
    if (unlockedRef.current.has(text)) return;
    unlockedRef.current.add(text);
    setQueue((q) => [...q, text]);
  }, []);

  const handleDone = useCallback(() => setQueue((q) => q.slice(1)), []);

  return (
    <section id="timeline" className="section timeline-section">
      <div className="container">
        <h2 className="section-title">Timeline</h2>

        <div className="timeline">
          {timelineByChapter.map((chapter) => (
            <section key={chapter.title} className="timeline-chapter">
              <header className="timeline-chapter-head">
                <p className="timeline-chapter-meta">
                  <span className="timeline-chapter-number">
                    Chapter {String(chapter.number).padStart(2, '0')}
                  </span>
                  <span>{chapter.period}</span>
                </p>
                <h3 className="timeline-chapter-title">{chapter.title}</h3>
                <p className="timeline-chapter-summary">{chapter.summary}</p>
              </header>
              <ol className="timeline-items">
                {chapter.items.map((item, i) => (
                  <TimelineItem
                    key={`${item.year}-${item.month}-${item.title}`}
                    item={item}
                    index={i}
                    onAchieve={handleAchieve}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <AchievementToast queue={queue} onDone={handleDone} />
    </section>
  );
};

export default Timeline;
