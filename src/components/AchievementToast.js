import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { on } from '../game/bus';
import { unlock } from '../game/achievements';
import { useLang } from '../i18n';
import './AchievementToast.css';

const SHOW_MS = 4200;
const SECTION_IDS = ['about', 'works', 'timeline', 'links', 'contact'];

// サイトの見方に応じた実績（撃破数は SpaceGame が解除する）
const useAchievementTracking = () => {
  // 全セクション踏破：各セクションが画面の中央を通ったら訪問済みにする
  useEffect(() => {
    const visited = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          visited.add(entry.target.id);
          observer.unobserve(entry.target);
        });
        if (visited.size === SECTION_IDS.length) unlock('allSections');
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // 最後まで読んだ：ページの下端まで来たら
  useEffect(() => {
    const check = () => {
      const bottom = document.documentElement.scrollHeight - window.innerHeight - 4;
      if (window.scrollY > 0 && window.scrollY >= bottom) unlock('readToEnd');
    };
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  // 作品鑑賞家：作品の詳細を3種類開いたら
  useEffect(() => {
    const opened = new Set();
    return on('workOpen', ({ id }) => {
      opened.add(id);
      if (opened.size >= 3) unlock('works3');
    });
  }, []);
};

const AchievementToast = () => {
  const [queue, setQueue] = useState([]);
  const { t } = useLang();
  const current = queue[0];

  useAchievementTracking();

  useEffect(() => on('achievement', (item) => setQueue((q) => [...q, item])), []);

  useEffect(() => {
    if (!current) return undefined;
    const timer = setTimeout(() => setQueue((q) => q.slice(1)), SHOW_MS);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="achievement-region" role="status" aria-live="polite">
      {current && (
        <div className="achievement-toast" key={current.id}>
          <span className="achievement-icon" aria-hidden="true"><FaTrophy /></span>
          <span className="achievement-body">
            <span className="achievement-label">{t('実績解除')}</span>
            <span className="achievement-title">{t(current.title)}</span>
            <span className="achievement-desc">{t(current.desc)}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementToast;
