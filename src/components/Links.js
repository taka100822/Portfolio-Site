import React, { useEffect, useRef, useState } from 'react';
import { linksData } from '../constants/links';
import './Links.css';

const TYPE_INTERVAL = 35;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// RPG のファストトラベル画面：カーソルを合わせた行き先の説明をメッセージ窓に1文字ずつ出す
const Links = () => {
  const [selected, setSelected] = useState(0);
  const [typed, setTyped] = useState(0);
  const itemRefs = useRef([]);

  const message = linksData[selected].description;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setTyped(message.length);
      return undefined;
    }
    setTyped(0);
    const timer = setInterval(() => {
      setTyped((n) => {
        if (n >= message.length) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, TYPE_INTERVAL);
    return () => clearInterval(timer);
  }, [message]);

  // ↑↓ でコマンドを選び直せるようにする
  const handleKeyDown = (event) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (selected + step + linksData.length) % linksData.length;
    itemRefs.current[next]?.focus();
  };

  const done = typed >= message.length;

  return (
    <section id="links" className="section links-section">
      <div className="container">
        <h2 className="section-title">Links</h2>

        <div className="warp">
          <div className="warp-window warp-menu">
            <p className="warp-ask">どこへ ワープしますか？</p>
            <ul className="warp-list" onKeyDown={handleKeyDown}>
              {linksData.map((link, i) => (
                <li key={link.title}>
                  <a
                    ref={(el) => { itemRefs.current[i] = el; }}
                    className={`warp-item ${i === selected ? 'is-selected' : ''}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
                  >
                    <span className="warp-cursor" aria-hidden="true">▶</span>
                    <link.icon className="warp-icon" aria-hidden="true" />
                    <span className="warp-name">{link.title}</span>
                    <span className="warp-host">{new URL(link.url).hostname}</span>
                    <span className="sr-only">：{link.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="warp-window warp-message" aria-hidden="true">
            <p className="warp-speaker">{linksData[selected].title}</p>
            <p className="warp-text">
              {message.slice(0, typed)}
              {done && <span className="warp-next">▼</span>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Links;
