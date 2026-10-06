import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import HeroRing from './HeroRing';
import { heroImages } from '../constants/hero';
import { worksData } from '../constants/works';
import { useLang } from '../i18n';
import './Hero.css';

const IMAGE_BASE = `${process.env.PUBLIC_URL}/Image/works/`;

const TITLE = '人生の一部となる\n体験を創造する。';
const META = '京都工芸繊維大学大学院でゲームのインタラクションを研究しながら、\n学生ゲーム制作団体「TOMSN」の代表として開発を率いています。';

// 改行を <br> にする。brClass を渡すと、その改行は CSS で出し分けられる。
// 英語は改行を消したときに単語がくっつかないよう、改行の前に空白を入れる
const lines = (text, brClass) => text.split('\n').map((line, i, arr) => (
  <React.Fragment key={i}>
    {i > 0 && <br className={brClass} />}
    {line}
    {i < arr.length - 1 && /[\x21-\x7e]$/.test(line) && ' '}
  </React.Fragment>
));

const Hero = ({ onSelectWork }) => {
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const { t } = useLang();

  // キャプションがコピーに重ならないよう、コピーの高さを CSS に渡す
  useEffect(() => {
    const copy = copyRef.current;
    const update = () => heroRef.current.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(copy);
    return () => ro.disconnect();
  }, []);

  const ringItems = useMemo(() => heroImages
    .map(({ workId, path }) => {
      const work = worksData.find((w) => w.id === workId);
      return work && { work, title: work.title, src: encodeURI(IMAGE_BASE + path) };
    })
    .filter(Boolean), []);

  const handleSelect = useCallback((item) => onSelectWork(item.work), [onSelectWork]);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <HeroRing items={ringItems} heroRef={heroRef} onSelect={handleSelect} />

      <div className="hero-copy" ref={copyRef}>
        <h1 className="hero-title">{lines(t(TITLE))}</h1>
        <div>
          <p className="hero-meta">
            <strong>{t('Taka10 / 27卒ゲームプランナー')}</strong>
            {lines(t(META), 'hero-meta-br')}
          </p>
          <div className="hero-actions">
            <a className="hero-btn hero-btn-primary" href="#works">{t('作品を見る')}</a>
            <a
              className="hero-btn hero-btn-ghost"
              href="https://twitter.com/Taka10822GC"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Xで連絡する')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
