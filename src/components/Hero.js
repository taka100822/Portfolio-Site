import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import HeroRing from './HeroRing';
import { heroImages } from '../constants/hero';
import { worksData } from '../constants/works';
import './Hero.css';

const IMAGE_BASE = `${process.env.PUBLIC_URL}/Image/works/`;

const Hero = ({ onSelectWork }) => {
  const heroRef = useRef(null);
  const copyRef = useRef(null);

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
        <h1 className="hero-title">人の記憶に残る<br />遊びを設計する。</h1>
        <div>
          <p className="hero-meta">
            <strong>Taka10 / 27卒ゲームプランナー</strong>
            京都工芸繊維大学大学院でゲームのインタラクションを研究しながら、<br className="hero-meta-br" />学生ゲーム制作団体「TOMSN」の代表として開発を率いています。
          </p>
          <div className="hero-actions">
            <a className="hero-btn hero-btn-primary" href="#works">作品を見る</a>
            <a
              className="hero-btn hero-btn-ghost"
              href="https://twitter.com/Taka10822GC"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xで連絡する
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
