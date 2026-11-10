# Yeecord Pixel

首頁的像素標題、按鈕和小遊戲用的字型，取自 [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font) 12px proportional（SIL OFL 1.1，授權見 `OFL.txt`）

為了不讓訪客下載整套字，這裡只留首頁用到的字。`yeecord-pixel-tc.woff2` 取自 `zh_tw` 版，`yeecord-pixel-sc.woff2` 取自 `zh_hans` 版

首頁的文字出現新的字時要重新產生，否則那個字會退回一般字型。做法是下載上游的 woff2，用 `subset-font` 取出下列檔案裡出現過的所有字，再加上 ASCII

- `src/home/stall/content.ts`
- `src/home/stall/Stall.tsx`
- `src/home/Trust.tsx`
- `src/features.ts`
- `src/i18n/translations/zh-cn.ts`
- `src/i18n/translations/en.ts`
