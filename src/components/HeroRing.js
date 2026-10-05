import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { drawLineArt } from '../utils/lineArt';

const BASE_SPEED = 9;      // deg/s
const HOVER_SPEED = 3;
const SCROLL_BOOST = 60;   // スクロールで加わる最大速度
const REVEAL_START = 0.86; // cos(θ) がこれを超えると実画像が見え始める
const INTRO_MS = 1100;
const INTRO_STAGGER_MS = 45;
const CARD_SPACING = 1.12; // カード幅に対する円周上の間隔
const TILT_DEG = 3;        // リングの傾き。大きいと正面カードが下がり縦の場所を食う

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const randomScatter = () => {
  const x = (Math.random() - 0.5) * 900;
  const y = (Math.random() - 0.5) * 500;
  const z = Math.random() * 600 + 200;
  const r = (Math.random() - 0.5) * 120;
  return `translate3d(${x}px, ${y}px, ${z}px) rotate(${r}deg) scale(.6)`;
};

const RingCard = ({ src, alt, index, cardRef }) => {
  const canvasRef = useRef(null);
  const [scatter] = useState(randomScatter);
  const [fallback, setFallback] = useState(false);

  const handleLoad = (e) => {
    try {
      drawLineArt(e.currentTarget, canvasRef.current);
    } catch {
      setFallback(true);
    }
  };

  return (
    <div
      className="ring-card"
      ref={cardRef}
      data-index={index}
      style={{ '--scatter': scatter, '--delay': `${index * INTRO_STAGGER_MS}ms` }}
    >
      {fallback ? (
        <img className="ring-lineart ring-lineart-fallback" src={src} alt="" draggable={false} />
      ) : (
        <canvas className="ring-lineart" ref={canvasRef} />
      )}
      <img className="ring-photo" src={src} alt={alt} draggable={false} onLoad={handleLoad} />
    </div>
  );
};

const HeroRing = ({ items, heroRef, onSelect }) => {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const ringRef = useRef(null);
  const slotRefs = useRef([]);
  const cardRefs = useRef([]);
  const radiusRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [frontIndex, setFrontIndex] = useState(0);

  const count = items.length;
  const step = 360 / count;

  // リング半径とカード配置
  useLayoutEffect(() => {
    const layout = () => {
      const slot = slotRefs.current[0];
      if (!slot) return;
      const radius = Math.round((slot.offsetWidth * CARD_SPACING * count) / (2 * Math.PI));
      radiusRef.current = radius;
      slotRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
      });
    };
    layout();
    window.addEventListener('resize', layout);
    // カード幅はコピーの高さにも連動するので、要素サイズの変化でも組み直す
    const ro = typeof ResizeObserver !== 'undefined' && slotRefs.current[0]
      ? new ResizeObserver(layout)
      : null;
    if (ro) ro.observe(slotRefs.current[0]);
    return () => {
      window.removeEventListener('resize', layout);
      if (ro) ro.disconnect();
    };
  }, [count, step]);

  // 回転・ドラッグ・スクロール連動
  useEffect(() => {
    const stage = stageRef.current;
    const reduce = prefersReducedMotion();

    const readyTimer = setTimeout(() => setReady(true), 60);
    if (reduce) return () => clearTimeout(readyTimer);

    let introDone = false;
    const introTimer = setTimeout(() => { introDone = true; }, INTRO_MS + count * INTRO_STAGGER_MS);

    let angle = 0;
    let velocity = BASE_SPEED;
    let hovering = false;
    let dragging = false;
    let dragMoved = 0;
    let lastX = 0;
    let dragVel = 0;
    let front = 0;
    let rafId = 0;
    let last = performance.now();

    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };

    const onDown = (e) => {
      dragging = true;
      dragMoved = 0;
      lastX = e.clientX;
      dragVel = 0;
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragMoved += Math.abs(dx);
      const delta = dx * 0.18;
      angle += delta;
      dragVel = delta * 60;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      velocity = dragVel;
    };

    const onClick = (e) => {
      if (dragMoved > 6) return;
      // pointer capture 中は click の target が stage になるため座標から引く
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const card = el && el.closest('.ring-card');
      if (card) onSelect(items[Number(card.dataset.index)]);
    };

    const scrollProgress = () => {
      const h = heroRef.current ? heroRef.current.offsetHeight : window.innerHeight;
      return Math.min(1, Math.max(0, window.scrollY / h));
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sp = scrollProgress();

      if (!dragging && introDone) {
        const target = (hovering ? HOVER_SPEED : BASE_SPEED) + SCROLL_BOOST * sp;
        velocity += (target - velocity) * Math.min(1, dt * 2.5);
        angle -= velocity * dt;
      }

      wrapRef.current.style.transform =
        `translateY(${-sp * 180}px) translateZ(${-radiusRef.current}px) rotateX(${-TILT_DEG}deg) scale(${1 - sp * 0.25})`;
      ringRef.current.style.transform = `rotateY(${angle}deg)`;

      // 正面ほど実画像に
      let best = -2;
      let bestIndex = 0;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const facing = Math.cos(((i * step + angle) * Math.PI) / 180);
        const reveal = introDone ? Math.max(0, (facing - REVEAL_START) / (1 - REVEAL_START)) : 0;
        card.style.setProperty('--reveal', reveal.toFixed(3));
        card.style.filter = facing < 0 ? `brightness(${0.55 + facing * 0.25})` : '';
        if (facing > best) { best = facing; bestIndex = i; }
      });

      if (bestIndex !== front) {
        front = bestIndex;
        setFrontIndex(bestIndex);
      }

      rafId = requestAnimationFrame(tick);
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('click', onClick);
    rafId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(introTimer);
      cancelAnimationFrame(rafId);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('click', onClick);
    };
  }, [items, count, step, heroRef, onSelect]);

  const front = items[frontIndex];

  return (
    <>
      {/* 装飾。作品へは Works セクションからもたどれるので支援技術には隠す */}
      <div className={`ring-stage ${ready ? 'is-ready' : ''}`} ref={stageRef} aria-hidden="true">
        <div className="ring-wrap" ref={wrapRef}>
          <div className="ring" ref={ringRef}>
            {items.map((item, i) => (
              <div
                className="ring-slot"
                key={item.src}
                ref={(el) => { slotRefs.current[i] = el; }}
              >
                <RingCard
                  src={item.src}
                  alt={item.title}
                  index={i}
                  cardRef={(el) => { cardRefs.current[i] = el; }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`ring-caption ${ready ? 'is-ready' : ''}`} aria-hidden="true">
        {front && front.title}
      </div>

      <span className="ring-hint" aria-hidden="true">ドラッグで回せます</span>
    </>
  );
};

export default HeroRing;
