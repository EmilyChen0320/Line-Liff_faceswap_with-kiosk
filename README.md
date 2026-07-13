# ESG 與戰地阿特合影 Kiosk

三立 ESG 展區使用的 kiosk 版 AI 合影 / 換臉應用。畫面固定以 1080x1920 直式 kiosk 舞台呈現，使用者選擇性別後，由現場攝影機拍照，送出照片與指定模板 ID 產生合影結果，最後透過 QR Code 在手機開啟並儲存圖片。

## 目前流程

1. 直接進入選擇性別頁
2. 拍攝照片，倒數 5 秒後自動截圖
3. 確認照片並送出生圖
4. 生圖期間顯示進度條
5. 顯示合影結果
6. 掃描 QR Code 到手機儲存圖片

## 已調整內容

- 固定為 ESG 單一體驗：與戰地阿特合影
- 移除 3Q Day 的多模板選擇流程
- 保留男女模板分流，方便後端用不同 template ID
- 保留 kiosk 攝影機拍照、結果頁、QR Code 下載流程
- 生圖期間提供前端模擬進度條，API 完成後補到 100%
- 前端使用 `battlefieldArt` 作為本次合影模板 key

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發

```bash
npm run dev
```

### 打包

```bash
npm run build
```

打包後檔案會輸出到 `dist/`。

## Runtime 設定

`index.html` 內的 `window.endpoint` 可在打包後調整，主要設定如下：

```js
window.endpoint = {
  baseURL: 'https://example.com/api',
  timeout: 30000,
  templateApiBaseURL: 'http://set.fanpokka.ai:8067',
  debug: false,
}
```

模板 ID 會先透過 `GET /api/templates` 依 `ESG` 與性別字樣自動解析。

## 主要檔案

- `resources/js/faceswap/App.vue`：kiosk 主流程
- `resources/js/config/enterpriseDay.js`：ESG 合影模板與性別設定
- `resources/js/faceswap/components/EnterpriseGenderSelection.vue`：性別選擇
- `resources/js/faceswap/components/FaceSwapCameraCapture.vue`：拍照、倒數、送出生圖與進度條
- `resources/js/faceswap/components/FaceSwapResult.vue`：結果頁與 QR Code
- `resources/js/faceswap/components/QRCodeModal.vue`：手機掃碼下載彈窗

## API 整合

目前使用既有模板生圖服務封裝：

- `resources/js/services/aliImageStudioService.js`
- `GET {templateApiBaseURL}/api/templates`：查詢 ESG 男 / 女模板
- `POST {templateApiBaseURL}/api/templates/{templateId}/generate`：送出拍攝照片
- request body 使用 `multipart/form-data`，欄位為 `image`
- response 取 `outputs[0].url` 作為結果圖，若為相對路徑會補上 API base URL
- 是否需要 token 或其他 headers
- QR short link 是否由後端產生

## 注意事項

- 本專案目前是 kiosk-only，不做 LIFF 手機版流程。
- 使用攝影機需要 HTTPS 或 localhost，並需瀏覽器授權。
- 使用者照片屬於個資，部署時需確認保存、刪除與下載策略。
- 現階段缺正式模板 ID，需待後端提供後替換 `battlefieldArt` 的男女 ID。
- 生圖進度條目前是前端模擬進度；若後端未來提供任務進度 API，可改成真實進度。
