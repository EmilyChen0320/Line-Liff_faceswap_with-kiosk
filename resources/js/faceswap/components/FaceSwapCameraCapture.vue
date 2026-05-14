<template>
  <div :class="['camera-page', isKioskMode ? 'camera-page--kiosk' : 'camera-page--mobile']">
    <div class="enterprise-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>

    <button class="camera-home-button" type="button" @click="goHome" @touchend.prevent="goHome">
      <img :src="imageUrls.enterprise.backIcon" alt="" draggable="false" />
      <img :src="imageUrls.enterprise.backText" alt="回首頁" draggable="false" />
    </button>

    <main class="enterprise-content">
      <img :src="imageUrls.enterprise.logo" alt="2026 企業日" class="enterprise-logo" draggable="false" />

      <section class="enterprise-panel">
        <img :src="imageUrls.enterprise.panel" alt="" class="enterprise-panel-bg" draggable="false" />
        <div class="enterprise-panel-inner">

          <!-- Step indicator -->
          <div class="step-indicator">
            <span class="step-num">步驟 3/4</span>
            <span class="step-name">拍攝照片</span>
          </div>

          <!-- Status text (only for countdown / captured) -->
          <div v-if="cameraState === 'countdown' || cameraState === 'captured'" class="camera-status-text">
            {{ cameraState === 'countdown' ? '拍照倒數中，請勿移動' : '請確認照片' }}
          </div>

          <!-- Camera Area -->
          <div class="camera-area">
            <!-- Idle / initializing -->
            <div v-if="cameraState === 'idle'" class="camera-state-box">
              <EnterpriseLoadingAnimation class="camera-loading-anim" />
              <div class="camera-loading-text">正在開啟相機...</div>
            </div>

            <!-- Live preview -->
            <video v-if="cameraState === 'preview' || cameraState === 'countdown'"
                   ref="videoElement"
                   class="camera-video"
                   autoplay
                   playsinline />

            <!-- Countdown overlay -->
            <div v-if="cameraState === 'countdown'" class="countdown-overlay">
              <div class="countdown-number animate-pulse">{{ countdownNumber }}</div>
            </div>

            <!-- Captured photo -->
            <img v-if="cameraState === 'captured'"
                 :src="capturedImage"
                 class="camera-captured"
                 alt="Captured photo" />

            <!-- Generating -->
            <div v-if="cameraState === 'loading'" class="camera-state-box">
              <EnterpriseLoadingAnimation class="camera-loading-anim camera-loading-anim--large" />
              <div class="camera-generating-text">照片生成中，請稍後</div>
            </div>
          </div>

          <!-- Countdown instructions -->
          <div v-if="cameraState === 'countdown'" class="countdown-instructions">
            <p>請在五秒內確認你的位置</p>
            <p>並保持畫面內僅有一人</p>
            <p>五官清晰無遮擋</p>
          </div>

          <!-- Action buttons -->
          <div v-if="cameraState !== 'countdown'" class="action-row">
            <button v-if="cameraState !== 'captured'" class="action-button" type="button"
                    style="touch-action: manipulation;" @click="goBack" @touchend.prevent="goBack">
              <img :src="imageUrls.enterprise.retakeIpButton" alt="重選IP" />
            </button>
            <button v-if="cameraState === 'preview'" class="action-button" type="button"
                    style="touch-action: manipulation;" @click="startCountdown" @touchend.prevent="startCountdown">
              <img :src="imageUrls.enterprise.takePhotoButton" alt="開始拍照" />
            </button>
            <button v-if="cameraState === 'captured'" class="action-button" type="button"
                    style="touch-action: manipulation;" @click="retakePhoto" @touchend.prevent="retakePhoto">
              <img :src="imageUrls.enterprise.retakeIpButton" alt="再拍一次" />
            </button>
            <button v-if="cameraState === 'captured'" class="action-button" type="button"
                    style="touch-action: manipulation;" @click="nextStep" @touchend.prevent="nextStep">
              <img :src="isKioskMode ? imageUrls.enterprise.nextFocusLarge : imageUrls.enterprise.nextFocusSmall" alt="下一步" />
            </button>
          </div>

          <!-- Photo tips (only when not captured / countdown) -->
          <div v-if="cameraState !== 'captured' && cameraState !== 'countdown'" class="photo-tips">
            <div>1. 點擊後會有5秒準備期，請在5秒內擺好姿勢</div>
            <div>2. 請保持畫面人物面向，避免多人以上亂識</div>
            <div>3. 請避免頭髮或帽子遮擋五官，避免過髮等遮擋</div>
            <div>4. 請勿晃動，以免因照片模糊而影響生成品質</div>
          </div>

        </div>
      </section>
    </main>

    <img :src="imageUrls.enterprise.footer" alt="" class="enterprise-footer" draggable="false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { imageUrls } from '../../config/imageUrls.js'
import EnterpriseLoadingAnimation from './EnterpriseLoadingAnimation.vue'

const props = defineProps({
  selectedTemplate: {
    type: String,
    default: ''
  },
  selectedCharacter: {
    type: String,
    default: ''
  },
  isKioskMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['captured', 'generate', 'back', 'home'])

// Camera states: idle, preview, countdown, captured, loading
const cameraState = ref('idle')  // Will be set to preview after camera starts
const videoElement = ref(null)
const capturedImage = ref('')
const countdownNumber = ref(5)
const stream = ref(null)

// Start camera and preview
async function startCamera(autoStart = false) {
  try {
    // Get user media
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      }
    })

    cameraState.value = 'preview'

    // Wait for next tick to ensure video element is rendered
    await new Promise(resolve => setTimeout(resolve, 100))

    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
      // Only start countdown if not auto-starting (user clicked button)
      if (!autoStart) {
        setTimeout(startCountdown, 1000)
      }
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('無法存取相機，請確保已授予相機權限')
  }
}

// Start countdown
function startCountdown() {
  cameraState.value = 'countdown'
  countdownNumber.value = 5

  const interval = setInterval(() => {
    countdownNumber.value--
    if (countdownNumber.value <= 0) {
      clearInterval(interval)
      capturePhoto()
    }
  }, 1000)
}

// Capture photo
function capturePhoto() {
  if (!videoElement.value) return

  const video = videoElement.value

  // 1. 獲取原始視訊尺寸 (例如 1280x720)
  const videoW = video.videoWidth
  const videoH = video.videoHeight
  const videoRatio = videoW / videoH

  // 2. 獲取螢幕上實際顯示的方框尺寸 (例如 300x400)
  const rect = video.getBoundingClientRect()
  const displayW = rect.width
  const displayH = rect.height
  const displayRatio = displayW / displayH

  // 3. 計算裁切參數 (source x, source y, source width, source height)
  let sx, sy, sWidth, sHeight

  if (videoRatio > displayRatio) {
    // 情況 A：視訊比顯示框更「寬」 (例如視訊 16:9，顯示框 1:1)
    // 邏輯：保留高度，裁掉左右兩邊
    sHeight = videoH
    sWidth = sHeight * displayRatio // 根據顯示比例算出應該保留的寬度
    sy = 0
    sx = (videoW - sWidth) / 2 // 從中間開始裁
  } else {
    // 情況 B：視訊比顯示框更「瘦」 (例如視訊 4:3，顯示框 9:16)
    // 邏輯：保留寬度，裁掉上下兩邊
    sWidth = videoW
    sHeight = sWidth / displayRatio // 根據顯示比例算出應該保留的高度
    sx = 0
    sy = (videoH - sHeight) / 2 // 從中間開始裁
  }

  // 4. 創建 Canvas
  const canvas = document.createElement('canvas')

  // 【關鍵修正】: 設定 Canvas 大小為「裁切後的高解析度尺寸」，而不是螢幕顯示尺寸
  // 這樣可以確保圖片清晰度
  canvas.width = sWidth
  canvas.height = sHeight

  const ctx = canvas.getContext('2d')

  // 5. 執行鏡像翻轉和裁切繪製
  // 先進行鏡像翻轉變換
  ctx.translate(canvas.width, 0) // 將原點移到右邊
  ctx.scale(-1, 1) // 水平翻轉
  
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)
  
  // 重置變換矩陣
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  // 6. 輸出圖片
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.95)
  cameraState.value = 'captured'

  // Stop camera stream
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

// Retake photo
function retakePhoto() {
  capturedImage.value = ''
  startCamera()
}

// Next step - show loading then emit
async function nextStep() {
  cameraState.value = 'loading'

  // Convert base64 to blob
  const response = await fetch(capturedImage.value)
  const blob = await response.blob()
  const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })

  // Emit generate event after a short delay to show loading
  setTimeout(() => {
    emit('generate', file)
  }, 2000)
}

// Go back to previous step
function goBack() {
  // Clean up camera stream if active
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  emit('home')
}

function goHome() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  emit('back')
}

// Auto-start camera on mount
onMounted(() => {
  // Automatically start the camera when component mounts
  startCamera(true)
})

// Cleanup on unmount
onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
/* ── Page container ── */
.camera-page {
  position: relative;
  overflow: hidden;
  background: #000;
  color: #1f1f1f;
}

.camera-page--kiosk {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  min-width: 1080px;
  min-height: 1920px;
}

.camera-page--mobile {
  width: 100%;
  min-height: 100vh;
}

/* ── Background & footer ── */
.enterprise-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.enterprise-footer {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
}

/* ── Back button ── */
.camera-home-button {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

/* ── Enterprise layout ── */
.enterprise-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.enterprise-logo {
  object-fit: contain;
  user-select: none;
}

.enterprise-panel {
  position: relative;
}

.enterprise-panel-bg {
  width: 100%;
  height: 100%;
  object-fit: fill;
  user-select: none;
}

.enterprise-panel-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Step indicator ── */
.step-indicator {
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.step-num {
  display: inline-block;
  color: #888888;
  transform: skewX(-4deg);
}

.step-name {
  display: inline-block;
  color: #222222;
  font-weight: 700;
  transform: skewX(-6deg) scaleY(0.99);
}

/* ── Camera status text ── */
.camera-status-text {
  width: 100%;
  text-align: center;
  font-weight: 700;
  color: #1f1f1f;
}

/* ── Camera area ── */
.camera-area {
  width: 100%;
  flex-shrink: 0;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.camera-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.camera-loading-text {
  color: #666;
}

.camera-generating-text {
  color: #1f1f1f;
  font-weight: 700;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transform: scaleX(-1);
  border: 2px solid #d1d5db;
}

.camera-captured {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #d1d5db;
}

/* ── Countdown overlay ── */
.countdown-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.countdown-number {
  font-weight: 700;
  color: #fff;
}

/* ── Countdown instructions ── */
.countdown-instructions {
  text-align: center;
  color: #1f1f1f;
  width: 100%;
}

.countdown-instructions p {
  margin: 0;
}

/* ── Action buttons ── */
.action-row {
  display: flex;
  width: 100%;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
  transition: opacity 0.2s;
}

.action-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ── Photo tips ── */
.photo-tips {
  width: 100%;
  border-radius: 8px;
  background: rgba(31, 31, 31, 0.06);
  color: #1f1f1f;
  text-align: left;
  line-height: 1.8;
}

/* ════════════════════════════════════════
   Kiosk  (1080 × 1920)
════════════════════════════════════════ */
.camera-page--kiosk .enterprise-content {
  min-height: 1920px;
}

.camera-page--kiosk .camera-home-button {
  left: 54px;
  top: 58px;
  gap: 12px;
}

.camera-page--kiosk .camera-home-button img:first-child { width: 56px; }
.camera-page--kiosk .camera-home-button img:last-child  { width: 168px; }

.camera-page--kiosk .enterprise-logo {
  width: 580px;
  margin-top: 82px;
}

.camera-page--kiosk .enterprise-panel {
  width: min(88%, 960px);
  height: 1560px;
  margin-top: 38px;
}

.camera-page--kiosk .enterprise-panel-inner {
  padding: 80px 78px;
}

.camera-page--kiosk .step-indicator {
  gap: 10px;
  margin-bottom: 44px;
}

.camera-page--kiosk .step-num  { font-size: 38px; line-height: 32px; }
.camera-page--kiosk .step-name { font-size: 58px; line-height: 50px; }

.camera-page--kiosk .camera-status-text {
  font-size: 48px;
  margin-bottom: 24px;
}

.camera-page--kiosk .camera-area  { height: 936px; }

.camera-page--kiosk .camera-video,
.camera-page--kiosk .camera-captured { border-width: 4px; }

.camera-page--kiosk .camera-loading-anim        { width: 360px; height: 360px; margin-bottom: 32px; }
.camera-page--kiosk .camera-loading-anim--large { width: 420px; height: 420px; margin-bottom: 64px; }

.camera-page--kiosk .camera-loading-text    { font-size: 24px; }
.camera-page--kiosk .camera-generating-text { font-size: 36px; }

.camera-page--kiosk .countdown-number { font-size: 20rem; }

.camera-page--kiosk .countdown-instructions {
  margin-top: 48px;
  margin-bottom: 48px;
}

.camera-page--kiosk .countdown-instructions p {
  font-size: 30px;
  margin-bottom: 8px;
}

.camera-page--kiosk .action-row {
  margin-top: 40px;
  gap: 32px;
}

.camera-page--kiosk .action-button { height: 72px; }

.camera-page--kiosk .photo-tips {
  margin-top: 40px;
  padding: 40px;
  font-size: 24px;
}

/* ════════════════════════════════════════
   Mobile
════════════════════════════════════════ */
.camera-page--mobile .enterprise-content {
  min-height: 100vh;
}

.camera-page--mobile .camera-home-button {
  left: 22px;
  top: 24px;
  gap: 5px;
}

.camera-page--mobile .camera-home-button img:first-child { width: 26px; }
.camera-page--mobile .camera-home-button img:last-child  { width: 78px; }

.camera-page--mobile .enterprise-logo {
  width: 230px;
  margin-top: 56px;
}

.camera-page--mobile .enterprise-panel {
  width: min(92%, 370px);
  height: 720px;
  margin-top: 18px;
}

.camera-page--mobile .enterprise-panel-inner {
  padding: 50px 24px 40px;
}

.camera-page--mobile .step-indicator {
  gap: 5px;
  margin-bottom: 22px;
}

.camera-page--mobile .step-num  { font-size: 14px; line-height: 1; }
.camera-page--mobile .step-name { font-size: 20px; line-height: 1; }

.camera-page--mobile .camera-status-text {
  font-size: 16px;
  margin-bottom: 12px;
}

.camera-page--mobile .camera-area  { height: 360px; }

.camera-page--mobile .camera-loading-anim        { width: 180px; height: 180px; margin-bottom: 24px; }
.camera-page--mobile .camera-loading-anim--large { width: 220px; height: 220px; margin-bottom: 24px; }

.camera-page--mobile .camera-loading-text    { font-size: 14px; }
.camera-page--mobile .camera-generating-text { font-size: 18px; }

.camera-page--mobile .countdown-number { font-size: 9rem; }

.camera-page--mobile .countdown-instructions {
  margin-top: 28px;
  margin-bottom: 28px;
}

.camera-page--mobile .countdown-instructions p {
  font-size: 16px;
  margin-bottom: 4px;
}

.camera-page--mobile .action-row {
  margin-top: 24px;
  gap: 10px;
}

.camera-page--mobile .action-button { height: 44px; }

.camera-page--mobile .photo-tips {
  margin-top: 24px;
  padding: 16px;
  font-size: 12px;
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}
</style>
