// 画像の輪郭を Sobel フィルタで抽出し、青い線画として canvas に描く。
// クロスオリジン画像などで getImageData が使えない場合は例外を投げる。
const WIDTH = 360;
const HEIGHT = Math.round((WIDTH * 9) / 16);
const THRESHOLD = 0.12;

export const drawLineArt = (img, canvas) => {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // object-fit: cover 相当で描く
  const scale = Math.max(WIDTH / img.naturalWidth, HEIGHT / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (WIDTH - dw) / 2, (HEIGHT - dh) / 2, dw, dh);

  const src = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const gray = new Float32Array(WIDTH * HEIGHT);
  for (let i = 0; i < gray.length; i++) {
    const p = i * 4;
    gray[i] = src.data[p] * 0.299 + src.data[p + 1] * 0.587 + src.data[p + 2] * 0.114;
  }

  const out = ctx.createImageData(WIDTH, HEIGHT);
  const w = WIDTH;
  for (let y = 1; y < HEIGHT - 1; y++) {
    for (let x = 1; x < WIDTH - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] - 2 * gray[i - 1] - gray[i + w - 1] +
         gray[i - w + 1] + 2 * gray[i + 1] + gray[i + w + 1];
      const gy =
        -gray[i - w - 1] - 2 * gray[i - w] - gray[i - w + 1] +
         gray[i + w - 1] + 2 * gray[i + w] + gray[i + w + 1];
      const mag = Math.min(1, Math.hypot(gx, gy) / 220);
      const a = mag < THRESHOLD ? 0 : mag;
      const p = i * 4;
      // Signal Blue → Highlight Blue
      out.data[p] = 59 + 88 * a;
      out.data[p + 1] = 130 + 67 * a;
      out.data[p + 2] = 246;
      out.data[p + 3] = 255 * a;
    }
  }
  ctx.putImageData(out, 0, 0);
};
