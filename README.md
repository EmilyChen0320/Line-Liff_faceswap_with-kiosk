# 3Q Day Kiosk Face Swap

3Q Day 活動用的 kiosk 版 AI 換臉應用。畫面固定以 1080x1920 直式 kiosk 舞台呈現，使用者依序選擇性別與主題，透過現場攝影機拍照後產生結果圖。

## 功能特色

### 核心功能
- AI 換臉生圖
- 4 組企業日主題模板
  - 型男大主廚
  - 戲說台灣
  - 三立電視台
  - 請世界吃桌
- 男性 / 女性模板選擇
- Kiosk 攝影機拍照
- 結果圖顯示與下載

### 操作流程
1. 歡迎頁點擊進入活動
2. 選擇性別
3. 選擇主題
4. 拍照並確認照片
5. 等待 AI 生成結果
6. 下載結果圖或重新開始

### 裝置模式
- 目前專案僅支援 kiosk 版流程。
- 不支援透過 URL `mode` 參數切換裝置模式。
- 舊版多裝置分流說明已不適用於目前 3Q Day 專案。

## 快速開始

### 環境需求
- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. 安裝依賴
```bash
npm install
```

2. 配置環境

編輯 `index.html` 的 `window.endpoint`，設定 API、模板 ID、圖片處理與圖片上傳參數：

```javascript
window.endpoint = {
  baseURL: 'https://your-api-server.com/api',
  authToken: '123',
  timeout: 30000,
  templateApiBaseURL: '/template-api',
  enterpriseTemplateIds: {
    chef: {
      female: 1,
      male: 2
    },
    taiwanOpera: {
      female: 3,
      male: 4
    },
    sanliTv: {
      female: 5,
      male: 6
    },
    table: {
      female: 7,
      male: 8
    }
  },
  debug: true,
  imageProcessApi: 'https://stg-api.fanpokka.ai/api/static-resource',
  imageProcessParams: {
    scale: 2,
    format: 'jpg',
    quality: 90,
    width: 800,
    height: 600
  },
  enableImageProcessing: true,
  imageUploadApi: 'https://stg-line-crm.fanpokka.ai/partner/v1/files/upload',
  imageUploadHeaders: {
    'x-api-key': 'YOUR_API_KEY'
  },
  enableGCSUpload: false
};
```

3. 啟動開發伺服器
```bash
npm run dev
```

4. 打包正式版本
```bash
npm run build
```

打包後的檔案會輸出到 `dist/` 目錄。

## 專案結構

```text
line-liff-faceSwap/
├── dist/                          # 打包輸出目錄
├── public/                        # 靜態資源
│   └── images/                    # 公開圖片資源
├── resources/
│   ├── css/                       # 樣式表
│   └── js/
│       ├── faceswap/
│       │   ├── App.vue            # Kiosk 主流程
│       │   └── components/
│       │       ├── kiosk/
│       │       │   └── KioskHomepage.vue
│       │       ├── EnterpriseGenderSelection.vue
│       │       ├── EnterpriseTemplateSelection.vue
│       │       ├── FaceSwapCameraCapture.vue
│       │       ├── FaceSwapResult.vue
│       │       └── QRCodeModal.vue
│       ├── services/
│       │   ├── aliImageStudioService.js
│       │   ├── roadshowService.js
│       │   └── streamService.js
│       ├── config/
│       │   ├── enterpriseDay.js
│       │   └── imageUrls.js
│       └── app.js
├── index.html
├── vite.config.js
├── package.json
├── tailwind.config.cjs
└── README.md
```

## 技術棧

- Vue 3
- Vite 5
- Tailwind CSS
- axios
- html2canvas
- qrcode
- lottie-web

## API 整合

### Ali Image Studio 模板生圖
- 前端透過 `templateApiBaseURL` 呼叫模板生圖 API。
- Vercel 部署預設使用同網域 `/template-api` proxy，避免 HTTPS 頁面呼叫 HTTP API 被瀏覽器阻擋。
- 模板 ID 由 `enterpriseTemplateIds` 設定，並透過 `resources/js/config/enterpriseDay.js` 依主題與性別取值。

### 圖片處理與上傳
- `imageProcessApi` / `imageProcessParams` 控制圖片處理服務設定。
- `imageUploadApi` / `imageUploadHeaders` 控制結果圖上傳服務設定。

## 開發指南

### 啟用調試模式

在 `index.html` 中設置：

```javascript
window.endpoint = {
  // ...
  debug: true
};
```

調試模式會在控制台輸出目前 API 與圖片處理設定。

### 添加新模板

1. 準備模板圖片與選取狀態素材
2. 在 `imageUrls.js` 中添加圖片 URL
3. 更新 `EnterpriseTemplateSelection.vue` 的主題選項
4. 更新 `enterpriseDay.js` 與 `window.endpoint.enterpriseTemplateIds` 的模板 ID 對應

### 自定義樣式

本專案使用 Tailwind CSS，可以透過修改 `tailwind.config.cjs` 自定義主題。

## 故障排除

### 無法啟動攝影機
- 檢查瀏覽器攝影機權限
- 確認使用 HTTPS 或 localhost
- 確認 kiosk 裝置已連接可用攝影機

### 照片生成失敗
- 確認模板 ID 設定正確
- 檢查 `templateApiBaseURL` 是否能連到模板生圖 API
- 檢查照片格式與大小
- 查看瀏覽器 console 的 API 錯誤訊息

### URL mode 參數沒有作用
- 這是目前預期行為。
- 3Q Day 專案固定使用 kiosk 版流程，URL `mode` 參數不會切換裝置模式。

## 授權

本專案為私有專案 (Private)。

## 注意事項

- 本應用需要配合後端 API 使用
- 生成結果依賴 AI 模型品質
- 請保護使用者隱私，妥善處理個人照片
