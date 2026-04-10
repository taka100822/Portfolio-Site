# 🎮 Taka's Portfolio Site

ゲーム開発・Web開発の制作実績をまとめた個人ポートフォリオサイトです。

🔗 **[https://taka100822.github.io/Portfolio-Site](https://taka100822.github.io/Portfolio-Site)**

---

## 使用技術

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 18 |
| アニメーション | Framer Motion |
| アイコン | React Icons |
| スクロール検知 | React Intersection Observer |
| デプロイ | GitHub Pages (gh-pages) |

---

## 工夫した点

### Works モーダルギャラリー
作品カードをクリックするとモーダルが開き、スクリーンショットをスライド表示できます。  
画像は `useEffect` 内で番号付きファイル（例: `image2.png`, `image3.jpg`）を順に `Image()` でロードを試み、成功した分だけ自動でギャラリーに追加する仕組みを自作しました。`.png` / `.jpg` 両方の拡張子に対応しており、ファイル管理を柔軟にしています。

```js
// 番号付き画像を動的に探索・追加するカスタムフック
const tryExts = (n, exts) => {
  const img = new Image();
  img.onload = () => { setImages(prev => [...prev, src]); tryExts(n + 1, ALT_EXTS); };
  img.onerror = () => { tryExts(n, rest); };
  img.src = `${base}${n}${exts[0]}`;
};
```

### Canvas パーティクル背景
`requestAnimationFrame` を使った Canvas アニメーションを自前実装。  
80個のパーティクルが自律移動し、距離100px以内の粒子同士を線で結ぶことで星座のような表現を実現しています。距離に応じて線の透明度を変化させることで奥行き感を表現しました。

### スクロールアニメーション
`useScrollAnimation` カスタムフックで Intersection Observer をラップし、各セクションで一度だけトリガーされるフェードイン・スタガーアニメーションを実装。Framer Motion の `variants` と組み合わせることで、コンポーネント側のアニメーション定義をシンプルに保っています。

### コンポーネント設計
Works セクションでは `LINK_CONFIG` オブジェクトで各リンクの設定（アイコン・ラベル・スタイル）を一元管理し、カード表示とモーダル表示で同じデータから異なる UI を生成する構成にしています。これにより作品データの追加・変更をロジックに触れずに行えます。

---

## ページ構成

`Hero` → `About` → `Works` → `Skills` → `Timeline` → `Links` → `Contact`