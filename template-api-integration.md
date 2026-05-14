# Ali Image Studio — 模板生圖 API 串接文件

> 本文件說明如何透過 REST API 串接「模板生圖」功能。  
> 閱讀完本文件即可完整整合：查詢模板、上傳使用者圖片、發送生圖請求、取得輸出圖片。

---

## 基本資訊

| 項目 | 內容 |
|------|------|
| Base URL | `http://<伺服器 IP>:8067` |
| 協定 | HTTP/1.1 |
| 認證 | 無（內部服務，建議部署在內網） |
| 圖片上傳格式 | `multipart/form-data` |
| 回應格式 | `application/json`，編碼 UTF-8 |
| 生圖等待時間 | 約 **15 ～ 60 秒**（由阿里雲 AI 模型決定） |

---

## 完整串接流程

```
1. 查詢可用模板列表
        ↓
2. 選擇模板（取得 template_id）
        ↓
3. 上傳使用者圖片並呼叫生圖 API（同一個請求完成）
        ↓
4. 解析回應，取得輸出圖片 URL
        ↓
5. 下載圖片（直接 GET 圖片 URL）
```

---

## API 端點詳細說明

### 1. 查詢模板列表

取得目前所有可用的模板，包含模板的參考圖片資訊。

```
GET /api/templates
```

**回應範例：**

```json
[
  {
    "id": 1,
    "name": "女大廚",
    "prompt": "以圖2為唯一完整模板，圖2所有視覺元素...",
    "size": "1K",
    "created_at": "2026-05-13T04:26:55.388222+00:00",
    "inputs": [
      {
        "id": 1,
        "filename": "e8bef421-1b91-480b-b88c-7170b0670baf.png",
        "original_name": "女大廚.png",
        "display_order": 0,
        "url": "/uploads/inputs/e8bef421-1b91-480b-b88c-7170b0670baf.png",
        "thumb_url": "/uploads/thumbs_in/e8bef421-1b91-480b-b88c-7170b0670baf.jpg"
      }
    ]
  }
]
```

**欄位說明：**

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | int | 模板 ID，呼叫生圖時使用 |
| `name` | string | 模板名稱 |
| `prompt` | string | 模板內建的生圖提示詞（自動帶入，不需另外傳） |
| `size` | string | 輸出尺寸（`1K` = 1024×1024，`2K` = 較大解析度） |
| `inputs[].url` | string | 模板參考圖的完整路徑（接在 Base URL 後即可存取） |
| `inputs[].thumb_url` | string | 縮圖路徑（400×400 JPEG，用於預覽顯示） |

---

### 2. 查詢單筆模板

```
GET /api/templates/{template_id}
```

回應格式與列表中的單筆物件相同。

---

### 3. 套用模板生圖 ⭐ 核心端點

上傳使用者圖片並以指定模板進行 AI 生圖。

```
POST /api/templates/{template_id}/generate
Content-Type: multipart/form-data
```

**請求參數：**

| 欄位名稱 | 類型 | 必填 | 說明 |
|----------|------|------|------|
| `image` | File | ✅ | 使用者圖片，格式支援 JPG / PNG / WEBP，建議大小 < 10MB |

> ⚠️ **注意**：`prompt`、`size`、`model` 等生圖參數全部由模板內部決定，呼叫端**不需要也不能**傳入這些參數。

**成功回應（HTTP 200）：**

```json
{
  "id": 693,
  "prompt": "以圖2為唯一完整模板...",
  "size": "1K",
  "n": 1,
  "status": "completed",
  "error_message": null,
  "request_id": "7f55ec6a-b5ae-9628-8d66-abe0693cf383",
  "duration_ms": 10611,
  "model": "wan2.7-image",
  "negative_prompt": "",
  "created_at": "2026-05-13T13:27:37.282126+00:00",
  "inputs": [
    {
      "id": 1347,
      "filename": "abc123.jpg",
      "original_name": "user_photo.jpg",
      "url": "/uploads/inputs/abc123.jpg",
      "thumb_url": "/uploads/thumbs_in/abc123.jpg"
    }
  ],
  "outputs": [
    {
      "id": 757,
      "filename": "216eb1bb-cf59-4554-b481-65bd04ac8879.png",
      "url": "/uploads/outputs/216eb1bb-cf59-4554-b481-65bd04ac8879.png",
      "thumb_url": "/uploads/thumbs/216eb1bb-cf59-4554-b481-65bd04ac8879.jpg"
    }
  ]
}
```

**輸出圖片取得方式：**

```
outputs[0].url = "/uploads/outputs/216eb1bb-...png"

完整下載 URL = http://<伺服器 IP>:8067/uploads/outputs/216eb1bb-...png
```

**錯誤回應：**

| HTTP 狀態碼 | 情況 |
|-------------|------|
| `400` | 未傳入圖片，或圖片格式不支援 |
| `404` | 指定的 template_id 不存在 |
| `500` | 伺服器設定錯誤（API 金鑰未設定） |
| `502` | 上游 AI API 回應錯誤或逾時 |

錯誤回應格式：
```json
{
  "detail": "錯誤原因說明"
}
```

---

## 程式碼範例

### Python（requests）

```python
import requests

BASE_URL = "http://192.168.1.100:8067"

# Step 1：查詢模板列表，取得 template_id
templates = requests.get(f"{BASE_URL}/api/templates").json()
template_id = templates[0]["id"]  # 選擇第一個模板
print(f"使用模板：{templates[0]['name']} (ID: {template_id})")

# Step 2：上傳使用者圖片並生圖
with open("user_photo.jpg", "rb") as f:
    response = requests.post(
        f"{BASE_URL}/api/templates/{template_id}/generate",
        files={"image": ("user_photo.jpg", f, "image/jpeg")},
        timeout=120,  # 生圖最長等 120 秒
    )

response.raise_for_status()
data = response.json()

# Step 3：取得輸出圖片 URL 並下載
if data["status"] == "completed" and data["outputs"]:
    output_url = BASE_URL + data["outputs"][0]["url"]
    print(f"生圖成功，耗時：{data['duration_ms']}ms")
    
    img_data = requests.get(output_url).content
    with open("result.png", "wb") as f:
        f.write(img_data)
    print("圖片已儲存為 result.png")
else:
    print(f"生圖失敗：{data.get('error_message')}")
```

---

### JavaScript（fetch / Node.js）

```javascript
const BASE_URL = 'http://192.168.1.100:8067';

async function generateFromTemplate(templateId, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);          // imageFile 為 File 或 Blob 物件

  const response = await fetch(
    `${BASE_URL}/api/templates/${templateId}/generate`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const outputUrl = BASE_URL + data.outputs[0].url;
  console.log(`生圖成功，耗時 ${data.duration_ms}ms`);
  console.log(`圖片網址：${outputUrl}`);
  return outputUrl;
}

// 使用範例（瀏覽器環境）
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async () => {
  const templateId = 1;
  const url = await generateFromTemplate(templateId, fileInput.files[0]);
  document.getElementById('result-img').src = url;
});
```

---

### cURL

```bash
# 查詢模板列表
curl http://192.168.1.100:8067/api/templates

# 套用模板生圖（指定 template_id=1，上傳 user_photo.jpg）
curl -X POST http://192.168.1.100:8067/api/templates/1/generate \
  -F "image=@user_photo.jpg" \
  --max-time 120
```

---

## 圖片尺寸說明

模板的 `size` 欄位對應輸出解析度：

| size 值 | 輸出解析度 | 說明 |
|---------|-----------|------|
| `1K` | 1024 × 1024 | 預設，正方形 |
| `2K` | 約 2048 × 2048 | 較高解析度（生圖時間較長） |

> ⚠️ WAN 2.7 模型的輸出比例由**最後一張傳入的圖片**決定。本 API 的圖片送入順序為：
> `使用者圖片（C）→ 模板參考圖 A → 模板參考圖 B`
> 因此最終輸出比例以**模板最後一張參考圖**的比例為準。

---

## 重要注意事項

1. **請求逾時設定**：生圖需要 15～60 秒，請將 HTTP 客戶端的 timeout 設為至少 **120 秒**。

2. **圖片格式限制**：
   - 支援格式：`image/jpeg`、`image/png`、`image/webp`
   - 建議上傳前裁切為接近正方形（與模板比例一致效果較好）
   - 單張圖片大小建議不超過 **10MB**

3. **並發限制**：建議避免同時送出大量請求，以免佔滿 AI API 配額。

4. **輸出圖片保存**：回應中的 `outputs[].url` 為相對路徑，需自行拼接 Base URL。圖片儲存在伺服器上，可直接用 GET 下載。

5. **生圖失敗處理**：若 `status` 為 `failed`，錯誤原因在 `error_message` 欄位，常見原因為 AI 服務暫時不可用或圖片內容不符合規範。

---

## Swagger 互動文件

服務啟動後可直接在瀏覽器開啟 API 文件並線上測試：

```
http://<伺服器 IP>:8067/docs
```
