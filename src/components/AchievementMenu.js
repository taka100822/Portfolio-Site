import React, { useEffect, useRef, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { on } from '../game/bus';
import { ACHIEVEMENTS, isUnlocked } from '../game/achievements';
import { useLang } from '../i18n';
import './AchievementMenu.css';

const IDS = Object.keys(ACHIEVEMENTS);
const countUnlocked = () => IDS.filter(isUnlocked).length;

// ヘッダー右の「実績 3/6」。押すと下に小さな一覧が出る（画面は覆わない）
const AchievementMenu = ({ closeSignal }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(countUnlocked);
  const [fresh, setFresh] = useState(false); // 解除した直後に数字を一度だけ光らせる
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useLang();

  useEffect(() => on('achievement', () => {
    setCount(countUnlocked());
    setFresh(true);
  }), []);

  // スマホのメニューを開いたら閉じる
  useEffect(() => setOpen(false), [closeSignal]);

  // 外を押すか Esc で閉じる
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="ach-menu" ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className={`ach-menu-button ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-controls="ach-menu-list"
        aria-label={`${t('実績')} ${count} / ${IDS.length}`}
        onClick={() => setOpen((v) => !v)}
      >
        {/* スマホでは「実績」の文字の代わりにトロフィーを出す */}
        <span className="ach-menu-label" aria-hidden="true">{t('実績')}</span>
        <FaTrophy className="ach-menu-icon" aria-hidden="true" />
        <span aria-hidden="true">
          <span
            className={`ach-menu-count ${fresh ? 'is-fresh' : ''}`}
            onAnimationEnd={() => setFresh(false)}
          >
            {count}
          </span>
          /{IDS.length}
        </span>
      </button>

      {open && (
        <div className="ach-menu-pop" id="ach-menu-list">
          <p className="ach-menu-head">
            <span>ACHIEVEMENTS</span>
            <span>{count} / {IDS.length}</span>
          </p>
          <ul>
            {IDS.map((id) => {
              const item = ACHIEVEMENTS[id];
              const done = isUnlocked(id);
              return (
                <li key={id} className={done ? '' : 'is-locked'}>
                  <span className="ach-menu-mark" aria-hidden="true">{done ? '■' : '□'}</span>
                  <span className="ach-menu-text">
                    <b>{done ? t(item.title) : '？？？'}</b>
                    <span>{t(done ? item.desc : item.hint)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AchievementMenu;
