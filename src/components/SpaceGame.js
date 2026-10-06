import React, { useEffect, useRef } from 'react';
import { emit, prefersReducedMotion } from '../game/bus';
import { unlock } from '../game/achievements';
import './SpaceGame.css';

// 背景の星空に漂う敵を、文字やボタン以外の場所をクリックして撃つ。
// スコアと遊び方のヒントは Header の進捗線の下に出す（'shot' / 'kill' / 'hint' で伝える）
const SCORE_PER_KILL = 100;
// ときどき画面を高速で横切る白い敵（流れ星）。逃げられる前に撃てば一気に稼げる
const COMET_SCORE = 500;
const COMET_FIRST_MS = [4000, 7000]; // はじめて撃ってから
const COMET_INTERVAL_MS = [8000, 15000];
const COMET_CROSS_S = 5; // 画面を横切るのにかかる秒数
const COMET_HIT_RADIUS = 36;
const BULLET_MS = 140;
const HIT_RADIUS = 30;
const HIT_RADIUS_TOUCH = 40;
const RESPAWN_MS = [2200, 4200];
const HINT_DELAY_MS = 1200; // オープニングが終わってから
const HINT_MS = 15000;
const PIXEL = 3; // ドット絵の1ドットの大きさ

// ここから始まるクリックは撃たない（リンク・ボタン・画像など）
const BLOCKED = [
  'a', 'button', 'input', 'textarea', 'select', 'label', 'summary', 'video', 'iframe', 'img', 'svg',
  '[role="button"]', '[role="dialog"]', '[tabindex]',
  '.header', '.ring-card', '.work-card',
].join(',');

// 文字の上かどうかは、要素ではなくその位置に実際の文字があるかで決める
// （GDD の行のように、文字を含む枠の中の余白からは撃てるようにする）
const isOverText = (x, y) => {
  let node = null;
  if (document.caretPositionFromPoint) {
    node = document.caretPositionFromPoint(x, y)?.offsetNode;
  } else if (document.caretRangeFromPoint) {
    node = document.caretRangeFromPoint(x, y)?.startContainer;
  }
  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  const pad = 4;
  return [...range.getClientRects()].some((r) => (
    x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad
  ));
};

const canShootAt = (el, x, y) => {
  // 作品の詳細やメニューを開いている間（背面のスクロールを止めている間）は撃たない
  if (document.body.style.overflow === 'hidden') return false;
  if (el instanceof Element && el.closest(BLOCKED)) return false;
  if (window.getSelection()?.toString()) return false;
  return !isOverText(x, y);
};

// 2コマのドット絵（X が点灯するドット）
const ENEMY_FRAMES = [
  [
    '..X....X..',
    '...X..X...',
    '..XXXXXX..',
    '.XX.XX.XX.',
    'XXXXXXXXXX',
    'X.XXXXXX.X',
    'X.X....X.X',
    '...XX.XX..',
  ],
  [
    '..X....X..',
    'X..X..X..X',
    'X.XXXXXX.X',
    'XXX.XX.XXX',
    'XXXXXXXXXX',
    '.XXXXXXXX.',
    '..X....X..',
    '.X......X.',
  ],
];

const COMET_FRAMES = [
  [
    '...XXXX...',
    '.XXXXXXXX.',
    'XX.XX.XX.X',
    '.XXXXXXXX.',
    '..X....X..',
  ],
  [
    '...XXXX...',
    '.XXXXXXXX.',
    'X.XX.XX.XX',
    '.XXXXXXXX.',
    '...X..X...',
  ],
];

const GLOW = 8;

// 光るドット絵は毎フレーム描くと重いので、あらかじめ画像にしておく
// passes を増やすと光を重ねて強くする
const buildSprites = (frames, dpr, { fill, glow, pixel = PIXEL, blur = GLOW, passes = 1 }) => frames.map((rows) => {
  const w = rows[0].length * pixel + blur * 2;
  const h = rows.length * pixel + blur * 2;
  const c = document.createElement('canvas');
  c.width = w * dpr;
  c.height = h * dpr;
  const g = c.getContext('2d');
  g.scale(dpr, dpr);
  g.shadowColor = glow;
  g.shadowBlur = blur;
  g.fillStyle = fill;
  for (let i = 0; i < passes; i += 1) {
    rows.forEach((row, y) => [...row].forEach((cell, x) => {
      if (cell === 'X') g.fillRect(blur + x * pixel, blur + y * pixel, pixel, pixel);
    }));
  }
  return { canvas: c, w, h };
});

const rand = (min, max) => min + Math.random() * (max - min);

const makeStars = (W, H) => {
  const count = Math.round(Math.min(160, (W * H) / 9000));
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    depth: rand(0.05, 0.35), // スクロールに対する動きの割合（奥ほど遅い）
    size: Math.random() < 0.12 ? 2 : 1,
    alpha: rand(0.25, 0.8),
    phase: Math.random() * Math.PI * 2,
    blue: Math.random() < 0.4,
  }));
};

// 画面の外から入ってくる敵
const makeEnemy = (W, H, entering) => {
  const margin = 40;
  let x = rand(margin, W - margin);
  let y = rand(H * 0.15, H * 0.85);
  if (entering) {
    if (Math.random() < 0.5) x = Math.random() < 0.5 ? -margin : W + margin;
    else y = Math.random() < 0.5 ? -margin : H + margin;
  }
  const heading = Math.atan2(H / 2 - y, W / 2 - x) + rand(-0.6, 0.6);
  return {
    x,
    y,
    heading,
    speed: rand(18, 34),
    turn: rand(-0.25, 0.25),
    phase: Math.random() * Math.PI * 2,
  };
};

// 左右どちらかの画面外から、波打ちながら反対側へ抜けていく
const makeComet = (W, H) => {
  const fromLeft = Math.random() < 0.5;
  return {
    x: fromLeft ? -40 : W + 40,
    baseY: rand(H * 0.15, H * 0.88), // 画面の上から下まで、どの高さにも出る
    y: 0,
    vx: (fromLeft ? 1 : -1) * Math.max(140, W / COMET_CROSS_S),
    amp: rand(20, 45),
    phase: Math.random() * Math.PI * 2,
    trail: [],
  };
};

const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

const SpaceGame = ({ ready }) => {
  const canvasRef = useRef(null);
  const shotRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    let W = 0;
    let H = 0;
    let dpr = 1;
    let stars = [];
    let sprites = [];
    let cometSprites = [];
    let cometTrailSprites = [];
    let comet = null;
    let nextCometAt = Infinity; // はじめて撃つまでは出さない
    let score = 0;
    let enemies = [];
    const bullets = [];
    const particles = [];
    const popups = [];
    const respawns = [];
    let kills = 0;
    let frame = 0;
    let last = performance.now();
    let lastPointer = 'mouse';

    const enemyCount = () => (W < 600 ? 2 : 4);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(W, H);
      sprites = buildSprites(ENEMY_FRAMES, dpr, { fill: '#93C5FD', glow: 'rgba(59, 130, 246, 0.9)' });
      // 流れ星は新しい色を足さず、画面でいちばん明るいもの（純白＋強い光）として目立たせる
      cometSprites = buildSprites(COMET_FRAMES, dpr, {
        fill: '#FFFFFF', glow: 'rgba(147, 197, 253, 1)', pixel: 4, blur: 14, passes: 3,
      });
      cometTrailSprites = buildSprites(COMET_FRAMES, dpr, {
        fill: '#93C5FD', glow: 'rgba(59, 130, 246, 0.8)', pixel: 4, blur: 10,
      });
      enemies = enemies.filter((e) => e.x < W + 60 && e.y < H + 60);
      while (!reduce && enemies.length + respawns.length < enemyCount()) enemies.push(makeEnemy(W, H, false));
      enemies.length = Math.min(enemies.length, enemyCount());
      if (reduce) drawStars(0);
    };

    const drawStars = (time) => {
      const scroll = window.scrollY;
      stars.forEach((s) => {
        const y = (((s.y - scroll * s.depth) % H) + H) % H;
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(time / 900 + s.phase);
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fillStyle = s.blue ? '#93C5FD' : '#E6ECF5';
        ctx.fillRect(s.x, y, s.size, s.size);
      });
      ctx.globalAlpha = 1;
    };

    const explode = (x, y, points, big = false) => {
      for (let i = 0; i < (big ? 36 : 18); i += 1) {
        const a = rand(0, Math.PI * 2);
        const v = rand(60, big ? 320 : 220);
        particles.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: rand(1.4, 2.4),
          size: Math.random() < 0.5 ? PIXEL : PIXEL - 1,
        });
      }
      popups.push({ x, y, life: 1, points, big });
    };

    const fire = (x, y) => {
      if (!shotRef.current) {
        shotRef.current = true;
        emit('shot');
        emit('hint', null);
        nextCometAt = performance.now() + rand(...COMET_FIRST_MS);
      }
      // 画面の下端（クリック位置と中央の間）から撃ち上げる
      const fromX = x + (W / 2 - x) * 0.35;
      bullets.push({ fromX, fromY: H + 10, x, y, t: 0 });
    };

    const impact = (b) => {
      const radius = lastPointer === 'touch' ? HIT_RADIUS_TOUCH : HIT_RADIUS;
      let hit = false;
      if (comet && Math.hypot(comet.x - b.x, comet.y - b.y) <= Math.max(radius, COMET_HIT_RADIUS)) {
        hit = true;
        explode(comet.x, comet.y, COMET_SCORE, true);
        score += COMET_SCORE;
        kills += 1;
        comet = null;
        nextCometAt = performance.now() + rand(...COMET_INTERVAL_MS);
        unlock('cometKill');
      }
      enemies = enemies.filter((e) => {
        if (Math.hypot(e.x - b.x, e.y - b.y) > radius) return true;
        hit = true;
        explode(e.x, e.y, SCORE_PER_KILL);
        score += SCORE_PER_KILL;
        kills += 1;
        respawns.push(performance.now() + rand(...RESPAWN_MS));
        return false;
      });
      if (hit) {
        emit('kill', { kills, score });
        if (kills >= 1) unlock('firstKill');
        if (kills >= 10) unlock('kill10');
      } else {
        // 外れたら小さな波紋だけ
        particles.push({ ring: true, x: b.x, y: b.y, life: 1, decay: 3 });
      }
    };

    const step = (now) => {
      frame = requestAnimationFrame(step);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, W, H);
      drawStars(now);

      // 倒した敵の補充
      for (let i = respawns.length - 1; i >= 0; i -= 1) {
        if (now >= respawns[i]) {
          respawns.splice(i, 1);
          if (enemies.length < enemyCount()) enemies.push(makeEnemy(W, H, true));
        }
      }

      // 敵：ゆっくり向きを変えながら漂い、画面の端で折り返す
      const frameIndex = Math.floor(now / 450) % 2;
      enemies.forEach((e) => {
        e.heading += e.turn * dt + Math.sin(now / 1700 + e.phase) * 0.3 * dt;
        e.x += Math.cos(e.heading) * e.speed * dt;
        e.y += Math.sin(e.heading) * e.speed * dt;
        const m = 24;
        if ((e.x < m && Math.cos(e.heading) < 0) || (e.x > W - m && Math.cos(e.heading) > 0)) {
          e.heading = Math.PI - e.heading;
        }
        if ((e.y < 80 && Math.sin(e.heading) < 0) || (e.y > H - m && Math.sin(e.heading) > 0)) {
          e.heading = -e.heading;
        }
        const sprite = sprites[frameIndex];
        const bob = Math.sin(now / 600 + e.phase) * 2;
        ctx.drawImage(sprite.canvas, e.x - sprite.w / 2, e.y - sprite.h / 2 + bob, sprite.w, sprite.h);
      });

      // 流れ星：残像を引きながら横切り、反対側へ抜けたら次の出番まで待つ
      if (!comet && now >= nextCometAt) comet = makeComet(W, H);
      if (comet) {
        comet.x += comet.vx * dt;
        comet.y = comet.baseY + Math.sin(comet.x / 90 + comet.phase) * comet.amp;
        comet.trail.unshift({ x: comet.x, y: comet.y });
        comet.trail.length = Math.min(comet.trail.length, 12);
        const sprite = cometSprites[frameIndex];

        // 脈打つ光の輪
        const pulse = 0.75 + 0.25 * Math.sin(now / 120);
        const halo = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 44 * pulse);
        halo.addColorStop(0, 'rgba(147, 197, 253, 0.45)');
        halo.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(comet.x - 48, comet.y - 48, 96, 96);

        // こぼれる星屑
        if (Math.random() < 0.6) {
          particles.push({
            x: comet.x - Math.sign(comet.vx) * rand(10, 20), y: comet.y + rand(-8, 8),
            vx: -comet.vx * 0.1 + rand(-20, 20), vy: rand(-20, 20),
            life: 1, decay: rand(1.6, 2.6), size: Math.random() < 0.3 ? 3 : 2,
          });
        }

        comet.trail.forEach((p, i) => {
          if (i === 0) return;
          ctx.globalAlpha = 0.5 * (1 - i / comet.trail.length);
          ctx.drawImage(cometTrailSprites[frameIndex].canvas, p.x - sprite.w / 2, p.y - sprite.h / 2, sprite.w, sprite.h);
        });
        ctx.globalAlpha = 1;
        ctx.drawImage(sprite.canvas, comet.x - sprite.w / 2, comet.y - sprite.h / 2, sprite.w, sprite.h);
        if (comet.x < -60 || comet.x > W + 60) {
          comet = null;
          nextCometAt = now + rand(...COMET_INTERVAL_MS);
        }
      }

      // 弾
      for (let i = bullets.length - 1; i >= 0; i -= 1) {
        const b = bullets[i];
        b.t += (dt * 1000) / BULLET_MS;
        const p = Math.min(1, b.t);
        const hx = b.fromX + (b.x - b.fromX) * p;
        const hy = b.fromY + (b.y - b.fromY) * p;
        const tail = Math.max(0, p - 0.35);
        const grad = ctx.createLinearGradient(
          b.fromX + (b.x - b.fromX) * tail, b.fromY + (b.y - b.fromY) * tail, hx, hy
        );
        grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
        grad.addColorStop(1, 'rgba(147, 197, 253, 1)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.fromX + (b.x - b.fromX) * tail, b.fromY + (b.y - b.fromY) * tail);
        ctx.lineTo(hx, hy);
        ctx.stroke();
        if (b.t >= 1) {
          bullets.splice(i, 1);
          impact(b);
        }
      }

      // 爆発の破片と外れたときの波紋
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else if (p.ring) {
          ctx.globalAlpha = p.life * 0.8;
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (1 - p.life) * 16 + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.94;
          p.vy *= 0.94;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.life > 0.6 ? '#E6ECF5' : '#3B82F6';
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;

      // 「+100」「+500」
      ctx.textAlign = 'center';
      for (let i = popups.length - 1; i >= 0; i -= 1) {
        const p = popups[i];
        p.life -= dt * 1.1;
        if (p.life <= 0) {
          popups.splice(i, 1);
        } else {
          ctx.globalAlpha = Math.min(1, p.life * 2);
          ctx.font = `${p.big ? 22 : 16}px "DotGothic16", monospace`;
          ctx.fillStyle = p.big ? '#E6ECF5' : '#93C5FD';
          ctx.fillText(`+${p.points}`, p.x, p.y - 18 - (1 - p.life) * 28);
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduce) {
      // 動きを減らす設定では、止まった星空だけを見せる
      const redraw = () => {
        ctx.clearRect(0, 0, W, H);
        drawStars(0);
      };
      redraw();
      window.addEventListener('scroll', redraw, { passive: true });
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', redraw);
      };
    }

    // マウスは押した瞬間に撃つ。タッチはスクロールと区別するため、タップ（click）で撃つ
    const onPointerDown = (e) => {
      lastPointer = e.pointerType || 'mouse';
      if (lastPointer === 'touch' || e.button !== 0) return;
      if (canShootAt(e.target, e.clientX, e.clientY)) fire(e.clientX, e.clientY);
    };
    const onClick = (e) => {
      if (lastPointer !== 'touch') return;
      if (canShootAt(e.target, e.clientX, e.clientY)) fire(e.clientX, e.clientY);
    };
    // 撃てる場所では照準のカーソルにする
    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      document.documentElement.classList.toggle('is-aiming', canShootAt(e.target, e.clientX, e.clientY));
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('click', onClick);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      document.documentElement.classList.remove('is-aiming');
    };
  }, []);

  // オープニングが終わってから、まだ撃っていなければ遊び方を出す
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    const show = setTimeout(() => {
      if (!shotRef.current) emit('hint', { touch: isTouchDevice() });
    }, HINT_DELAY_MS);
    const hide = setTimeout(() => emit('hint', null), HINT_DELAY_MS + HINT_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [ready]);

  return <canvas className="space-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default SpaceGame;
