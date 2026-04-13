# Withdrawal Tracker

一個手機優先嘅靜態 PWA，用嚟追蹤 2026 年撳錢額度。資料儲存在 Firebase Realtime Database，未登入用戶可讀取，授權 Google 帳號可新增、編輯同刪除記錄。

## Files

- `index.html`: UI、樣式同 app logic
- `manifest.json`: PWA manifest
- `sw.js`: service worker 同快取策略

## App Config

以下常數寫喺 `index.html`：

- `TOTAL`: 全年額度，現時係 `100000`
- `DB_PATH`: 年度資料路徑，現時係 `records_2026`
- `ALLOWED`: 可寫入嘅 Google 帳號白名單
- `DEFAULT_RECORDS`: 空白資料庫首次初始化用嘅預設記錄

如果去到新一年，通常只需要更新：

1. `TOTAL`
2. `DB_PATH`
3. header / description 入面顯示嘅年份
4. 如有需要，更新 `DEFAULT_RECORDS`

## Firebase

App 直接使用 Firebase CDN SDK，唔需要 build step 或 `npm install`。

需要對應嘅 Firebase project：

- Authentication: Google Sign-In
- Realtime Database: 儲存記錄

注意：

- 前端白名單只係 UI 層控制
- 真正寫入限制要靠 Firebase Security Rules

## Local Use

因為係純靜態 app，直接用任何簡單 static server 已經得，例如：

```bash
python3 -m http.server 8000
```

之後開 `http://localhost:8000`。

## Deploy

可直接部署去任何靜態 hosting，例如 Firebase Hosting、Netlify 或 GitHub Pages。

## Notes

- 保持零 build step
- 優先延續單頁原生 HTML/CSS/JS 結構
- 如果之後再明顯加功能，先考慮按 guideline 拆 `app.js`
