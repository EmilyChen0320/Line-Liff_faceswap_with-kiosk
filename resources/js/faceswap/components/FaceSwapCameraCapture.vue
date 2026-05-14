<template>
  <div :class="['relative bg-black flex flex-col overflow-hidden', isKioskMode ? 'w-[1080px] h-[1920px]' : 'w-full min-h-screen']">
    <div class="absolute inset-0 enterprise-camera-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>
    <button class="camera-home-button" type="button" @click="goHome" @touchend.prevent="goHome">
      <img :src="imageUrls.enterprise.backIcon" alt="" draggable="false" />
      <img :src="imageUrls.enterprise.backText" alt="回首頁" draggable="false" />
    </button>
    <!-- Header -->
    <div :class="isKioskMode ? 'pt-20 pb-8' : 'py-4'" class="relative z-10 flex gap-5 justify-center items-center px-12 w-full font-bold">
      <img
        :src="imageUrls.enterprise.logo"
        :class="isKioskMode ? 'w-[580px]' : 'h-11'"
        class="object-contain"
        alt="2026 企業日"
      />
    </div>

    <div :class="isKioskMode ? 'mt-10 max-w-[878px]' : 'mt-14 max-w-[338px]'" class="relative z-10 w-full mx-auto">
      <div class="flex flex-col w-full">
        <!-- Step indicator -->
        <div class="camera-step-row" aria-label="目前步驟">
          <div
            v-for="step in steps"
            :key="step.id"
            :class="['camera-step-item', step.id === 3 ? 'is-active' : '', step.id < 3 ? 'is-done' : '']"
          >
            <span class="camera-step-dot">{{ step.id }}</span>
            <span class="camera-step-label">{{ step.label }}</span>
          </div>
        </div>

        <div class="flex justify-center font-bold whitespace-nowrap mb-6">
          <div :class="isKioskMode ? 'text-5xl' : 'text-base'" class="self-stretch my-auto text-[#EBD8B2]">
            {{
              cameraState === 'countdown' ? '拍照倒數中，請勿移動' :
              cameraState === 'captured' ? '請確認照片' :
              cameraState === 'preview' ? '需使用單人清晰正面照' :
              '需使用單人清晰正面照'
            }}
          </div>
        </div>

        <!-- Camera Area -->
        <div :class="isKioskMode ? 'mt-12' : 'mt-9'" class="w-full">
          <div :class="isKioskMode ? 'h-[936px]' : 'h-[360px]'" class="bg-black rounded-lg overflow-hidden relative">
        <!-- Camera Preview State (showing loading while camera initializes) -->
        <div v-if="cameraState === 'idle'" class="flex flex-col items-center justify-center h-full">
          <EnterpriseLoadingAnimation :class="isKioskMode ? 'w-[360px] h-[360px] mb-8' : 'w-[180px] h-[180px] mb-6'" />
          <div :class="isKioskMode ? 'text-2xl' : 'text-sm'" class="text-[#666]">正在開啟相機...</div>
        </div>

        <!-- Camera Stream -->
        <video v-if="cameraState === 'preview' || cameraState === 'countdown'"
               ref="videoElement"
               :class="isKioskMode ? 'border-4' : 'border-2'"
               class="w-full h-full object-cover border-[#EBD8B2] rounded-lg -scale-x-100"
               autoplay
               playsinline>
        </video>

        <!-- Countdown Overlay -->
        <div v-if="cameraState === 'countdown'"
             class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div :class="isKioskMode ? 'text-[20rem]' : 'text-9xl'" class="font-bold text-white animate-pulse">
            {{ countdownNumber }}
          </div>
        </div>

        <!-- Captured Photo -->
        <img v-if="cameraState === 'captured'"
             :src="capturedImage"
             :class="isKioskMode ? 'border-4' : 'border-2'"
             class="w-full h-full object-cover border-[#EBD8B2] rounded-lg"
             alt="Captured photo">

        <!-- Loading State -->
        <div v-if="cameraState === 'loading'" class="flex flex-col items-center justify-center h-full">
          <EnterpriseLoadingAnimation :class="isKioskMode ? 'w-[420px] h-[420px] mb-16' : 'w-[220px] h-[220px] mb-6'" />
          <div :class="isKioskMode ? 'text-4xl mb-6' : 'text-lg mb-2'" class="text-[#EBD8B2] font-bold">照片生成中，請稍後</div>
        </div>
          </div>
        </div>

        <!-- Countdown Instructions - Show only during countdown -->
        <div v-if="cameraState === 'countdown'" :class="isKioskMode ? 'mt-12 mb-12' : 'mt-8 mb-8'">
          <div class="text-center text-white space-y-2">
            <div :class="isKioskMode ? 'text-3xl' : 'text-lg'">請在五秒內確認你的位置</div>
            <div :class="isKioskMode ? 'text-3xl' : 'text-lg'">並保持畫面內僅有一人</div>
            <div :class="isKioskMode ? 'text-3xl' : 'text-lg'">五官清晰無遮擋</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="cameraState !== 'countdown'" :class="isKioskMode ? 'mt-12' : 'mt-8'" class="self-end w-full text-base font-bold text-white whitespace-nowrap rounded-md">
          <div :class="isKioskMode ? 'gap-8' : 'gap-3'" class="flex">
            <!-- Back Button (重選IP) - Only show when not captured -->
            <button v-if="cameraState !== 'captured'"
                    :class="isKioskMode ? 'h-[72px]' : 'h-11'"
                    class="flex-1 flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent"
                    style="touch-action: manipulation;"
                    @click="goBack"
                    @touchend.prevent="goBack">
              <img :src="imageUrls.enterprise.retakeIpButton" alt="重選IP" class="w-full h-full object-contain" />
            </button>

            <!-- Take Photo Button (開始拍照) when preview is ready -->
            <button v-if="cameraState === 'preview'"
                    :class="isKioskMode ? 'h-[72px]' : 'h-11'"
                    class="flex-1 flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent"
                    style="touch-action: manipulation;"
                    @click="startCountdown"
                    @touchend.prevent="startCountdown">
              <img :src="imageUrls.enterprise.takePhotoButton" alt="開始拍照" class="w-full h-full object-contain" />
            </button>

            <!-- Retake Photo Button when captured -->
            <button v-if="cameraState === 'captured'"
                    :class="isKioskMode ? 'h-[72px]' : 'h-11'"
                    class="flex-1 flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent"
                    style="touch-action: manipulation;"
                    @click="retakePhoto"
                    @touchend.prevent="retakePhoto">
              <img :src="imageUrls.enterprise.retakeIpButton" alt="再拍一次" class="w-full h-full object-contain" />
            </button>

            <!-- Next Step Button -->
            <button v-if="cameraState === 'captured'"
                    :class="isKioskMode ? 'h-[72px]' : 'h-11'"
                    class="flex-1 flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent"
                    style="touch-action: manipulation;"
                    @click="nextStep"
                    @touchend.prevent="nextStep">
              <img :src="isKioskMode ? imageUrls.enterprise.nextFocusLarge : imageUrls.enterprise.nextFocusSmall" alt="下一步" class="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        <!-- Instructions Below Buttons - Only show when not captured and not countdown -->
        <div v-if="cameraState !== 'captured' && cameraState !== 'countdown'" :class="isKioskMode ? 'mt-12' : 'mt-9'" class="text-base font-bold text-[#EBD8B2]">
          <div :class="isKioskMode ? 'p-10' : 'p-4'" class="bg-black rounded-lg">
            <div :class="isKioskMode ? 'text-2xl space-y-4' : 'text-sm space-y-2'" class="text-white text-left">
              <div>1. 點擊後會有5秒準備期，請在5秒內擺好姿勢</div>
              <div>2. 請保持畫面人物面向，避免多人以上亂識</div>
              <div>3. 請避免頭髮或帽子遮擋五官，避免過髮等遮擋</div>
              <div>4. 請勿晃動，以免因照片模糊而影響生成品質</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img :src="imageUrls.enterprise.footer" alt="" class="absolute bottom-0 left-0 z-[1] w-full pointer-events-none" />
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

const steps = [
  { id: 1, label: '選擇性別' },
  { id: 2, label: '選擇主題' },
  { id: 3, label: '拍照生成' },
  { id: 4, label: '下載圖片' },
]


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
.enterprise-camera-bg {
  background-size: cover;
  background-position: center;
}

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

.camera-home-button img:first-child {
  width: 56px;
}

.camera-home-button img:last-child {
  width: 168px;
}

.camera-home-button {
  left: 54px;
  top: 58px;
  gap: 12px;
}

.camera-step-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 44px;
}

.camera-step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(235, 216, 178, 0.48);
  font-size: 22px;
  white-space: nowrap;
}

.camera-step-item:not(:last-child)::after {
  display: block;
  width: 38px;
  height: 2px;
  margin-left: 18px;
  content: '';
  background: rgba(235, 216, 178, 0.3);
}

.camera-step-item.is-active,
.camera-step-item.is-done {
  color: #EBD8B2;
}

.camera-step-dot {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: 2px solid currentColor;
  border-radius: 999px;
  font-size: 22px;
  font-weight: 700;
}

.camera-step-item.is-active .camera-step-dot {
  background: #EBD8B2;
  color: #000;
}

@media (max-width: 600px) {
  .camera-home-button {
    left: 22px;
    top: 24px;
    gap: 5px;
  }

  .camera-home-button img:first-child {
    width: 26px;
  }

  .camera-home-button img:last-child {
    width: 78px;
  }

  .camera-step-row {
    gap: 6px;
    margin-bottom: 22px;
  }

  .camera-step-item {
    gap: 4px;
    font-size: 10px;
  }

  .camera-step-item:not(:last-child)::after {
    width: 8px;
    margin-left: 6px;
  }

  .camera-step-dot {
    width: 20px;
    height: 20px;
    border-width: 1px;
    font-size: 11px;
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}
</style>
