// 背景シューティング・経験値バー・実績トーストをつなぐ小さなイベントバス
const target = new EventTarget();

export const emit = (type, detail) => {
  target.dispatchEvent(new CustomEvent(type, { detail }));
};

export const on = (type, handler) => {
  const listener = (e) => handler(e.detail);
  target.addEventListener(type, listener);
  return () => target.removeEventListener(type, listener);
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
