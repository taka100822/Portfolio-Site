# Taka10 Portfolio

## 英訳（「英訳を更新して」と頼まれたら）

サイトは日本語の文言そのものをキーにして `src/i18n/en.json` から英訳を引く（`src/i18n/index.js` の `t()`）。有料の翻訳 API は使わず、英訳は Claude Code が書く。

1. `node scripts/translate.mjs --json` で未翻訳の文言を JSON 配列で受け取る（警告が出たら、JSX に直書きされた日本語を `t('…')` で囲む）
2. `{ "日本語": "English" }` の JSON ファイルを scratchpad に書く
   - 読み手は海外の採用担当・ゲーム開発者。直訳せず、ポートフォリオらしい簡潔な英語にする
   - 固有名詞（Taka10, TOMSN, BitSummit, unityroom, note など）はそのまま。既存の訳（`en.json`）と用語をそろえる
   - `\n` の数と `**太字**` の数は原文と同じにする（担当リストは行ごとに項目になる）
3. `node scripts/translate.mjs --apply <そのファイル>` で取り込む。最後に「✓ すべて英訳済みです」と出れば完了

`src/i18n/en.manual.json` はユーザーが手で直した訳なので、上書きしない。
