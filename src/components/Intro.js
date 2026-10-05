import React, { useEffect, useMemo, useState } from 'react';
import './Intro.css';

const BALL_SRC = `${process.env.PUBLIC_URL}/Image/favicon.png`;
const ROLL_MS = 2400;  // 転がって止まるまで
const HOLD_MS = 700;   // 止まってから幕が上がるまで
const EXIT_MS = 700;   // 幕が上がるアニメーション

// 1文字ずつ span にして、--i でアニメーションの開始をずらす
const splitChars = (text, className, offset = 0) => [...text].map((char, i) => (
  <span key={i} className={className} style={{ '--i': i + offset }}>{char}</span>
));

// サイトに入った直後、ボールがバウンドしながら転がってきて中央で止まる
const Intro = ({ onDone }) => {
  const [phase, setPhase] = useState('roll'); // roll → exit

  // 転がる距離から回転角を出して、滑らずに転がって見えるようにする
  const vars = useMemo(() => {
    const size = window.innerWidth < 600 ? 64 : 88;
    const distance = window.innerWidth / 2 + size;
    const rotation = (distance / (Math.PI * size)) * 360;
    return {
      '--ball': `${size}px`,
      '--dist': `${distance}px`,
      '--rot': `${rotation}deg`,
      '--roll-ms': `${ROLL_MS}ms`,
      '--exit-ms': `${EXIT_MS}ms`,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setPhase('exit'), ROLL_MS + HOLD_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onDone]);

  // クリックかキー入力でスキップ
  useEffect(() => {
    const skip = () => setPhase('exit');
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);

  useEffect(() => {
    if (phase !== 'exit') return undefined;
    const timer = setTimeout(onDone, EXIT_MS);
    return () => clearTimeout(timer);
  }, [phase, onDone]);

  return (
    <div
      className={`intro${phase === 'exit' ? ' is-exit' : ''}`}
      style={vars}
      onClick={() => setPhase('exit')}
      aria-hidden="true"
    >
      <div className="intro-stage">
        <div className="intro-floor" />
        <div className="intro-title">
          <p className="intro-name">
            {splitChars('Taka10', 'intro-name-char')}
          </p>
          <p className="intro-sub">
            <span className="intro-sub-en">{splitChars('Portfolio', 'intro-sub-char')}</span>
            <span className="intro-sub-ja">{splitChars('ゲームプランナー', 'intro-sub-char', 9)}</span>
          </p>
        </div>
        <div className="intro-shadow-x">
          <div className="intro-shadow" />
        </div>
        <div className="intro-ball-x">
          <div className="intro-ball-y">
            <div className="intro-ball-squash">
              <img className="intro-ball" src={BALL_SRC} alt="" draggable="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
