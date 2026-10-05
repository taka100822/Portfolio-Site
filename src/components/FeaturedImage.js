import React, { useRef, useState } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { drawLineArt } from '../utils/lineArt';

const LINE_ART_WIDTH = 720;

// 代表作の画像。画面に入ると 線画 → 実画像 に塗り替わり、
// そのあと注釈線が伸びて担当箇所を指す。
const FeaturedImage = ({ work, onOpen }) => {
  const [ref, inView] = useScrollAnimation({ threshold: 0.4 });
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const annotations = work.annotations || [];

  const handleLoad = (e) => {
    try {
      drawLineArt(e.currentTarget, canvasRef.current, LINE_ART_WIDTH);
    } catch {
      setFallback(true);
    }
  };

  return (
    <button
      ref={ref}
      className={`featured-image ${inView ? 'is-drawn' : ''}`}
      onClick={onOpen}
      aria-label={`${work.title}の詳細を見る`}
    >
      {fallback ? (
        <img className="featured-lineart featured-lineart-fallback" src={work.image} alt="" />
      ) : (
        <canvas className="featured-lineart" ref={canvasRef} />
      )}
      <img className="featured-photo" src={work.image} alt="" onLoad={handleLoad} />

      {annotations.length > 0 && (
        <>
          <svg className="annotation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {annotations.map((a, i) => (
              <line
                key={a.label}
                x1={a.x} y1={a.y} x2={a.lx} y2={a.ly}
                vectorEffect="non-scaling-stroke"
                style={{ '--i': i }}
              />
            ))}
          </svg>
          {annotations.map((a, i) => (
            <span
              key={a.label}
              className="annotation-dot"
              style={{ left: `${a.x}%`, top: `${a.y}%`, '--i': i }}
              aria-hidden="true"
            />
          ))}
          {annotations.map((a, i) => (
            <span
              key={a.label}
              className={`annotation-label ${a.lx < a.x ? 'is-left' : 'is-right'}`}
              style={{ left: `${a.lx}%`, top: `${a.ly}%`, '--i': i }}
            >
              {a.label}
            </span>
          ))}
        </>
      )}
    </button>
  );
};

export default FeaturedImage;
