import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaTrophy } from 'react-icons/fa';
import { timelineByYear, getTypeLabel } from '../constants/timeline';
import './Timeline.css';

const TOAST_MS = 3200;
const ACHIEVE_DWELL_MS = 500;

const TimelineItem = ({ item, onAchieve }) => {
  const [ref, inView] = useInView({ threshold: 0.6, skip: !item.achievement });

  // ナビでの移動などで通り過ぎただけでは出さず、しばらく画面に留まったら出す
  useEffect(() => {
    if (!inView || !item.achievement) return undefined;
    const timer = setTimeout(() => onAchieve(item.achievement), ACHIEVE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [inView, item.achievement, onAchieve]);

  return (
    <li ref={ref} className={`timeline-item ${item.achievement ? 'is-achievement' : ''}`}>
      <div className="timeline-head">
        <span className="timeline-month">{Number(item.month)}月</span>
        <span className="timeline-type">{getTypeLabel(item.type)}</span>
      </div>
      <h4 className="timeline-title">{item.title}</h4>
      <p className="timeline-description">{item.description}</p>
      <div className="timeline-tags">
        {item.details.map((detail) => <span key={detail}>{detail}</span>)}
      </div>
      {item.noteLink && (
        <a href={item.noteLink} target="_blank" rel="noopener noreferrer" className="timeline-note">
          noteで詳しく読む
        </a>
      )}
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
          {timelineByYear.map(({ year, items }) => (
            <section key={year} className="timeline-year">
              <h3 className="timeline-year-label">{year}</h3>
              <ol className="timeline-items">
                {items.map((item) => (
                  <TimelineItem
                    key={`${item.year}-${item.month}-${item.title}`}
                    item={item}
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
