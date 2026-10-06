import React, { useState } from 'react';
import { FaBookOpen, FaChevronDown, FaGamepad, FaRunning, FaTools, FaTrophy } from 'react-icons/fa';
import { timelineByChapter, getTypeLabel } from '../constants/timeline';
import { useLang } from '../i18n';
import './Timeline.css';

const TYPE_ICON = {
  game:       FaGamepad,
  project:    FaTools,
  education:  FaBookOpen,
  experience: FaRunning,
};

// 普段はタイトルだけ。行を押すと説明・タグ・note が開く
const TimelineItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const panelId = `timeline-${item.year}-${item.month}-${index}`;
  const TypeIcon = TYPE_ICON[item.type];

  return (
    <li className={`timeline-item ${item.achievement ? 'is-achievement' : ''} ${open ? 'is-open' : ''}`}>
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
          {t(getTypeLabel(item.type))}
        </span>
        <span className="timeline-title">
          {item.achievement && <FaTrophy className="timeline-trophy" aria-label={t('受賞・発表')} />}
          {t(item.title)}
        </span>
        <FaChevronDown className="timeline-chevron" aria-hidden="true" />
      </button>

      <div className="timeline-panel" id={panelId}>
        <div className="timeline-panel-inner">
          <p className="timeline-description">{t(item.description)}</p>
          <div className="timeline-tags">
            {item.details.map((detail) => <span key={detail}>{t(detail)}</span>)}
          </div>
          {item.noteLink && (
            <a href={item.noteLink} target="_blank" rel="noopener noreferrer" className="timeline-note">
              {t('noteで詳しく読む')}<span aria-hidden="true"> ↗</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

const Timeline = () => {
  const { t } = useLang();

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
                <h3 className="timeline-chapter-title">{t(chapter.title)}</h3>
                <p className="timeline-chapter-summary">{t(chapter.summary)}</p>
              </header>
              <ol className="timeline-items">
                {chapter.items.map((item, i) => (
                  <TimelineItem
                    key={`${item.year}-${item.month}-${item.title}`}
                    item={item}
                    index={i}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
