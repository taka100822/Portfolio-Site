import React, { useEffect, useMemo, useRef } from 'react';
import { useLang } from '../i18n';
import './Intro.css';

const BALL_SRC = `${process.env.PUBLIC_URL}/Image/favicon.png`;

// タイムライン（ms）
const T_BALL = 450;     // ボールの線画が描かれ始める
const T_PLAN = 650;     // 軌道の設計線が引かれ始める
const PLAN_MS = 650;    // 設計線を引き終わるまで
const T_DRIBBLE = 1350; // 1回ドリブルしてから
const DRIBBLE_MS = 380;
const T_SHOT = T_DRIBBLE + DRIBBLE_MS; // 設計線どおりにシュート
const SETTLE_MS = 1050; // スウィッシュしてから着地・余韻まで
const EXIT_MS = 800;    // ボールがヘッダーのロゴに収まるまで

const LOGO_SIZE = 32;
const TAU = Math.PI * 2;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const splitChars = (text, className, offset = 0) => [...text].map((char, i) => (
  <span key={i} className={className} style={{ '--i': i + offset }}>{char}</span>
));

// 画面サイズから「シュートの設計図」を作る。軌道は実際の放物線
const buildPlan = (W, H) => {
  const mobile = W < 600;
  const D = clamp(Math.min(W, H) * 0.085, 40, 76);
  const r = D / 2;
  const floorY = H * (mobile ? 0.66 : 0.72);
  const rim = {
    x: W * (mobile ? 0.66 : 0.72),
    y: floorY - H * (mobile ? 0.3 : 0.36),
    rx: D * 0.95,
  };
  rim.ry = rim.rx * 0.24;
  const start = { x: W * (mobile ? 0.17 : 0.2), y: floorY - H * 0.15 };

  // 頂点の高さを決めて、そこから重力と初速を逆算する
  const apexY = Math.max(H * 0.12, rim.y - Math.min(H * 0.2, W * 0.28));
  const rise = start.y - apexY;
  const g = (2 * rise) / 0.6 ** 2;
  const vy = -Math.sqrt(2 * g * rise);
  const tRim = (-vy + Math.sqrt(vy * vy + 2 * g * (rim.y - start.y))) / g;
  const vx = (rim.x - start.x) / tRim;
  const at = (t) => ({ x: start.x + vx * t, y: start.y + vy * t + 0.5 * g * t * t });

  const samples = Array.from({ length: 61 }, (_, i) => at((tRim * i) / 60));

  return {
    W, H, D, r, floorY, rim, start, g, vx, vy, tRim, at, samples,
    board: { x: rim.x + rim.rx + D * 0.28, top: rim.y - D * 1.7, bottom: rim.y + D * 0.35 },
    netH: D * 1.25,
    swishMs: T_SHOT + tRim * 1000,
  };
};

const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

// 網：菱形の目。ボールが通ると伸びて膨らみ、抜けたあとはばねで揺れ戻る
const netPath = (plan, net, ball) => {
  const { rim, netH, r } = plan;
  const rows = 4;
  const cols = 7;
  const bottomRx = rim.rx * 0.58;
  const points = [];
  for (let k = 0; k <= rows; k += 1) {
    const f = k / rows;
    const y = rim.y + f * (netH + net.stretch);
    let half = rim.rx + (bottomRx - rim.rx) * f;
    // ボールが中にあるときは、ボールの太さに合わせて網が押し広げられる
    if (ball) {
      const d = Math.abs(ball.y - y);
      if (d < r * 1.1) half = Math.max(half, Math.sqrt(Math.max(0, (r * 1.1) ** 2 - d * d)) * 1.04);
    }
    const cx = rim.x + net.sway * f;
    const row = [];
    const n = k % 2 ? cols - 1 : cols;
    for (let i = 0; i < n; i += 1) {
      const u = k % 2 ? (i + 0.5) / (cols - 1) : i / (cols - 1);
      row.push({ x: cx - half + u * half * 2, y: y + Math.sin(u * Math.PI) * rim.ry * (1 - f * 0.6) });
    }
    points.push(row);
  }
  const seg = (p, q) => (q ? `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}` : '');
  return points.slice(0, rows).map((row, k) => {
    const next = points[k + 1];
    const odd = k % 2 === 1;
    return row.map((p, i) => seg(p, odd ? next[i] : next[i - 1]) + seg(p, odd ? next[i + 1] : next[i])).join('');
  }).join('');
};

// 設計線どおりに決まるシュート→ ボールがそのままヘッダーのロゴになる
const Intro = ({ onDone }) => {
  const rootRef = useRef(null);
  const planRef = useRef(null);
  const inkRef = useRef(null);
  const ballRef = useRef(null);
  const shadowRef = useRef(null);
  const netRef = useRef(null);
  const exitRef = useRef(null); // 退場を始めた時刻（スキップ時は即座に入る）
  const { t } = useLang();

  const plan = useMemo(() => buildPlan(window.innerWidth, window.innerHeight), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    document.body.classList.add('is-intro');

    const { r, floorY, rim, start, g, netH } = plan;
    const ball = { x: start.x, y: start.y, vx: 0, vy: 0, angle: 0, squash: 0 };
    const net = { stretch: 0, stretchV: 0, sway: 0, swayV: 0 };
    let phase = 'idle'; // idle → dribble → flight → free → exit
    let simTime = 0;
    let exitFrom = null;
    let finished = false;
    let raf = 0;
    const t0 = performance.now();
    const sampleCount = plan.samples.length - 1;

    const startExit = (now) => {
      if (exitRef.current !== null) return;
      exitRef.current = now;
      rootRef.current.classList.add('is-exit');
      const mark = document.querySelector('.header-mark');
      const rect = mark?.getBoundingClientRect();
      exitFrom = {
        x: ball.x,
        y: ball.y,
        angle: ball.angle,
        to: rect && rect.width
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width }
          : { x: 40, y: 36, size: LOGO_SIZE },
      };
      // 回転は 2 周以上回して、ロゴと同じ向き（0°）でぴたりと止める
      exitFrom.toAngle = Math.ceil(ball.angle / TAU + 2) * TAU;
    };

    // 物理は 240Hz の固定ステップで回して、端末によらず同じ動きにする
    const step = (dt) => {
      const inNet = ball.y > rim.y && ball.y < rim.y + netH + net.stretch && Math.abs(ball.x - rim.x) < rim.rx * 1.2;
      if (inNet) {
        ball.vx = ball.vx * Math.exp(-14 * dt) + (rim.x - ball.x) * 30 * dt;
        ball.vy = Math.min(ball.vy, 900) * Math.exp(-2.2 * dt);
        net.stretch += (Math.max(0, ball.y - rim.y) * 0.35 - net.stretch) * 18 * dt;
        net.sway += (ball.x - rim.x) * 0.5 * 12 * dt;
      }
      ball.vy += g * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // 網はばね：抜けたあと何度か揺れて戻る
      if (!inNet) {
        net.stretchV += (-260 * net.stretch - 9 * net.stretchV) * dt;
        net.stretch += net.stretchV * dt;
      }
      net.swayV += (-220 * net.sway - 8 * net.swayV) * dt;
      net.sway += net.swayV * dt;

      // 床で弾む。弾むほど低く、最後は少し転がって止まる
      if (ball.y + r > floorY) {
        ball.y = floorY - r;
        if (ball.vy > 120) ball.squash = Math.min(0.22, ball.vy / 5000);
        ball.vy = ball.vy > 120 ? -ball.vy * 0.48 : 0;
        ball.vx *= 0.75;
      }
      if (ball.y + r >= floorY - 0.5) ball.angle += (ball.vx / r) * dt;
      else ball.angle -= 7 * dt; // 空中はバックスピン
      ball.vx *= Math.exp(-0.6 * dt);
      ball.squash *= Math.exp(-14 * dt);
    };

    const render = (t, now) => {
      // 設計線：点線が左から引かれていく
      const planP = clamp((t - T_PLAN) / PLAN_MS, 0, 1);
      planRef.current.setAttribute('d', pathOf(plan.samples.slice(0, Math.round(easeOut(planP) * sampleCount) + 1)));

      // 実際の軌跡：ボールの後ろを実線でなぞり、設計線とぴったり重なる
      if (phase === 'flight') {
        const n = Math.round(clamp(simTime / plan.tRim, 0, 1) * sampleCount);
        inkRef.current.setAttribute('d', pathOf([...plan.samples.slice(0, n + 1), ball]));
      }

      let { x, y, angle } = ball;
      let size = plan.D;
      if (exitFrom) {
        const p = easeInOut(clamp((now - exitRef.current) / EXIT_MS, 0, 1));
        const { to } = exitFrom;
        const cx = (exitFrom.x + to.x) / 2;
        const cy = Math.min(exitFrom.y, to.y) - plan.H * 0.18;
        // 弧を描いてロゴの位置へ
        x = (1 - p) ** 2 * exitFrom.x + 2 * (1 - p) * p * cx + p * p * to.x;
        y = (1 - p) ** 2 * exitFrom.y + 2 * (1 - p) * p * cy + p * p * to.y;
        size = plan.D + (to.size - plan.D) * p;
        angle = exitFrom.angle + (exitFrom.toAngle - exitFrom.angle) * p;
      }
      const sq = exitFrom ? 0 : ball.squash;
      const s = size / plan.D;
      // 床に接したときだけ下端を支点に潰す
      ballRef.current.setAttribute(
        'transform',
        `translate(${x.toFixed(2)} ${(y + (r * s) * sq).toFixed(2)}) scale(${(s * (1 + sq)).toFixed(4)} ${(s * (1 - sq)).toFixed(4)}) rotate(${((angle * 180) / Math.PI).toFixed(2)})`,
      );

      const height = clamp((floorY - r - ball.y) / (plan.H * 0.5), 0, 1);
      shadowRef.current.setAttribute('transform', `translate(${ball.x.toFixed(1)} ${floorY}) scale(${(1 - height * 0.7).toFixed(3)})`);
      shadowRef.current.style.opacity = exitFrom || t < 900 ? 0 : (1 - height * 0.8).toFixed(3);

      const inside = ball.y > rim.y - r && ball.y < rim.y + netH + r && Math.abs(ball.x - rim.x) < rim.rx * 1.5;
      netRef.current.setAttribute('d', netPath(plan, net, inside ? ball : null));
    };

    let last = t0;
    let acc = 0;
    const frame = (now) => {
      const t = now - t0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (phase === 'idle' && t >= T_DRIBBLE) phase = 'dribble';
      if (phase === 'dribble') {
        // 1回だけドリブル：床まで落ちて、潰れて、手元に戻る
        const p = clamp((t - T_DRIBBLE) / DRIBBLE_MS, 0, 1);
        const low = floorY - r;
        if (p < 0.5) {
          const q = p / 0.5;
          ball.y = start.y + (low - start.y) * q * q;
        } else {
          const q = (p - 0.5) / 0.5;
          if (ball.y >= low - 0.5 && q < 0.15) ball.squash = 0.16;
          ball.y = low + (start.y - low) * (1 - (1 - q) * (1 - q));
        }
        ball.squash *= Math.exp(-14 * dt);
        if (p >= 1) {
          phase = 'flight';
          simTime = 0;
          ball.x = start.x;
          ball.y = start.y;
        }
      } else if (phase === 'flight') {
        // リングまでは設計図の放物線そのものをなぞる
        simTime = (t - T_SHOT) / 1000;
        if (simTime >= plan.tRim) {
          Object.assign(ball, plan.at(plan.tRim));
          ball.vx = plan.vx;
          ball.vy = plan.vy + g * plan.tRim;
          rootRef.current.classList.add('is-swish');
          phase = 'free';
          inkRef.current.setAttribute('d', pathOf(plan.samples));
        } else {
          Object.assign(ball, plan.at(simTime));
          ball.angle -= 7 * dt;
        }
      } else if (phase === 'free' || phase === 'exit') {
        acc += dt;
        while (acc >= 1 / 240) {
          step(1 / 240);
          acc -= 1 / 240;
        }
      }

      if (phase === 'free' && t >= plan.swishMs + SETTLE_MS) startExit(now);
      if (exitRef.current !== null && phase !== 'exit') phase = phase === 'free' ? 'exit' : phase;

      render(t, now);

      if (exitRef.current !== null && now - exitRef.current >= EXIT_MS) {
        finished = true;
        onDone();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // クリックかキー入力でスキップ：その場からロゴへ飛んでいく
    const skip = () => startExit(performance.now());
    window.addEventListener('keydown', skip);
    const root = rootRef.current;
    root.addEventListener('click', skip);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
      root.removeEventListener('click', skip);
      document.body.style.overflow = '';
      document.body.classList.remove('is-intro');
      if (!finished) exitRef.current = null;
    };
  }, [plan, onDone]);

  const { D, r, floorY, rim, start, board, W } = plan;

  return (
    <div
      ref={rootRef}
      className="intro"
      style={{ '--swish-ms': `${plan.swishMs}ms`, '--exit-ms': `${EXIT_MS}ms` }}
      aria-hidden="true"
    >
      <div className="intro-bg" />
      <svg className="intro-svg" width={W} height={plan.H} viewBox={`0 0 ${W} ${plan.H}`}>
        <g className="intro-draft">
          {/* 床 */}
          <line className="intro-draw intro-floor" x1="0" y1={floorY} x2={W} y2={floorY} pathLength="1" />

          {/* ゴール：ボード → 支柱 → リング */}
          <rect className="intro-draw" style={{ '--d': '0.2s' }} x={board.x} y={board.top} width={D * 0.12} height={board.bottom - board.top} pathLength="1" />
          <path className="intro-draw" style={{ '--d': '0.35s' }} d={`M${board.x} ${rim.y - D * 0.05}H${rim.x + rim.rx}`} pathLength="1" />
          <path className="intro-draw intro-rim" style={{ '--d': '0.4s' }} d={`M${rim.x - rim.rx} ${rim.y}A${rim.rx} ${rim.ry} 0 0 1 ${rim.x + rim.rx} ${rim.y}`} pathLength="1" />

          {/* 設計線と、そのとおりに飛んだ実際の軌跡 */}
          <path ref={planRef} className="intro-plan" d="" />
          <path ref={inkRef} className="intro-ink" d="" />

          {/* ボールの線画：ここに本物のボールが入る */}
          <circle className="intro-draw intro-ghost" style={{ '--d': `${T_BALL / 1000}s` }} cx={start.x} cy={start.y} r={r} pathLength="1" />
        </g>

        <ellipse ref={shadowRef} className="intro-shadow" cx="0" cy="0" rx={r * 1.1} ry={r * 0.18} />

        <g ref={ballRef} transform={`translate(${start.x} ${start.y})`}>
          <image className="intro-ball" href={BALL_SRC} x={-r} y={-r} width={D} height={D} />
        </g>

        {/* ボールより手前：網とリングの前側 */}
        <g className="intro-draft">
          <path ref={netRef} className="intro-net" d="" />
          <path className="intro-draw intro-rim" style={{ '--d': '0.45s' }} d={`M${rim.x - rim.rx} ${rim.y}A${rim.rx} ${rim.ry} 0 0 0 ${rim.x + rim.rx} ${rim.y}`} pathLength="1" />
        </g>
      </svg>

      <div className="intro-title" style={{ left: start.x - r, top: floorY + 24 }}>
        <p className="intro-name">{splitChars('Taka10', 'intro-name-char')}</p>
        <p className="intro-sub">
          <span className="intro-sub-en">{splitChars('Portfolio', 'intro-sub-char')}</span>
          <span className="intro-sub-ja">{splitChars(t('ゲームプランナー'), 'intro-sub-char', 9)}</span>
        </p>
      </div>

      <p className="intro-skip">click to skip</p>
    </div>
  );
};

export default Intro;
