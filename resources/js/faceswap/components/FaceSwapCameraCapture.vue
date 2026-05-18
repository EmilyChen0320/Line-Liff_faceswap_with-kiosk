<template>
  <div class="relative h-full w-full overflow-hidden bg-black text-[#1f1f1f]">
    <div
      class="pointer-events-none absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"
    ></div>

    <main class="relative z-10 flex h-full flex-col items-center">
      <section class="relative mt-[160px] h-[1503px] w-[960px]">
        <img
          :src="imageUrls.enterprise.panel"
          alt=""
          class="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-fill"
          draggable="false"
        />

        <button
          class="absolute left-4 top-[42px] z-40 border-0 bg-transparent p-0"
          type="button"
          @click="goHome"
          @touchend.prevent="goHome"
        >
          <img :src="imageUrls.enterprise.backToHome" alt="回首頁" class="block w-[170px] select-none" draggable="false" />
        </button>

        <img
          :src="imageUrls.enterprise.logo"
          alt="2026 企業日"
          class="pointer-events-none absolute -top-[76px] right-[-16px] z-20 w-[470px] select-none object-contain"
          draggable="false"
        />

        <div class="relative z-30 flex h-full flex-col items-center px-[92px] pb-[110px] pt-[150px]">
          <div class="mb-[54px] flex w-full items-end justify-center gap-2.5">
            <span class="inline-block skew-x-[-4deg] text-[38px] leading-8 text-[#888888]">步驟 3/4</span>
            <span class="inline-block scale-y-[0.99] skew-x-[-6deg] text-[58px] font-bold leading-[50px] text-[#222222]">
              拍攝照片
            </span>
          </div>

          <div v-if="cameraState === 'countdown' || cameraState === 'captured'" class="mb-6 w-full text-center text-5xl font-bold">
            {{ cameraState === 'countdown' ? '拍照倒數中，請勿移動' : '請確認照片' }}
          </div>

          <div class="relative h-[800px] w-full shrink-0 overflow-hidden rounded-lg bg-black">
            <div v-if="cameraState === 'idle'" class="flex h-full flex-col items-center justify-center">
              <EnterpriseLoadingAnimation class="mb-8 h-[150px] w-[150px]" />
              <div class="text-2xl text-[#666666]">正在開啟相機...</div>
            </div>

            <video
              v-if="cameraState === 'preview' || cameraState === 'countdown'"
              ref="videoElement"
              class="h-full w-full scale-x-[-1] rounded-lg border-4 border-gray-300 object-cover"
              autoplay
              playsinline
            />

            <div v-if="cameraState === 'countdown'" class="absolute inset-0 flex items-center justify-center bg-black/50">
              <div class="animate-pulse text-[20rem] font-bold leading-none text-white">{{ countdownNumber }}</div>
            </div>

            <img
              v-if="cameraState === 'captured'"
              :src="capturedImage"
              class="h-full w-full rounded-lg border-4 border-gray-300 object-cover"
              alt="Captured photo"
              draggable="false"
            />

            <div v-if="cameraState === 'loading'" class="flex h-full flex-col items-center justify-center">
              <EnterpriseLoadingAnimation class="mb-16 h-[150px] w-[150px]" />
              <div class="text-4xl font-bold text-[#1f1f1f]">換臉生成中...請稍候</div>
            </div>
          </div>

          <div v-if="cameraState === 'countdown'" class="my-12 w-full text-center text-[42px] leading-relaxed">
            <p>請在五秒內確認你的位置</p>
            <p>並保持畫面內僅有一人</p>
            <p>五官清晰無遮擋</p>
          </div>

          <div v-if="cameraState !== 'countdown' && cameraState !== 'loading'" class="mt-10 flex w-full justify-between gap-8">
            <button
              v-if="cameraState !== 'captured'"
              class="flex h-[72px] flex-1 items-center justify-center border-0 bg-transparent p-0 [touch-action:manipulation]"
              type="button"
              @click="goBack"
              @touchend.prevent="goBack"
            >
              <img :src="imageUrls.enterprise.retakeIpButton" alt="重選IP" class="h-full w-full object-contain" draggable="false" />
            </button>
            <button
              v-if="cameraState === 'preview'"
              class="flex h-[72px] flex-1 items-center justify-center border-0 bg-transparent p-0 [touch-action:manipulation]"
              type="button"
              @click="startCountdown"
              @touchend.prevent="startCountdown"
            >
              <img :src="imageUrls.enterprise.takePhotoButton" alt="開始拍照" class="h-full w-full object-contain" draggable="false" />
            </button>
            <button
              v-if="cameraState === 'captured'"
              class="flex h-[72px] flex-1 items-center justify-center border-0 bg-transparent p-0 [touch-action:manipulation]"
              type="button"
              @click="retakePhoto"
              @touchend.prevent="retakePhoto"
            >
              <img :src="imageUrls.enterprise.retakeButton" alt="重新拍照" class="h-full w-full object-contain" draggable="false" />
            </button>
            <button
              v-if="cameraState === 'captured'"
              class="flex h-[72px] flex-1 items-center justify-center border-0 bg-transparent p-0 [touch-action:manipulation]"
              type="button"
              @click="nextStep"
              @touchend.prevent="nextStep"
            >
              <img :src="imageUrls.enterprise.nextFocusLarge" alt="下一步" class="h-full w-full object-contain" draggable="false" />
            </button>
          </div>

          <div
            v-if="cameraState !== 'captured' && cameraState !== 'countdown' && cameraState !== 'loading'"
            class="w-full p-10 text-left text-[32px] leading-[1.8]"
          >
            <div>• 點擊後會有5秒準備期，請在5秒內擺好姿勢</div>
            <div>• 請保持畫面人物面向，避免多人以上亂識</div>
            <div>• 請避免頭髮或帽子遮擋五官，避免過髮等遮擋</div>
            <div>• 請勿晃動，以免因照片模糊而影響生成品質</div>
          </div>
        </div>
      </section>
    </main>

    <img
      :src="imageUrls.enterprise.footer"
      alt=""
      class="pointer-events-none absolute inset-x-0 bottom-0 z-50 w-full select-none"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { imageUrls } from '../../config/imageUrls.js'
import EnterpriseLoadingAnimation from './EnterpriseLoadingAnimation.vue'

defineProps({
  selectedTemplate: {
    type: String,
    default: '',
  },
  selectedCharacter: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['captured', 'generate', 'back', 'home'])

const cameraState = ref('idle')
const videoElement = ref(null)
const capturedImage = ref('')
const countdownNumber = ref(5)
const stream = ref(null)

async function startCamera({ autoCountdown = false } = {}) {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      },
    })

    cameraState.value = 'preview'
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
      if (autoCountdown) {
        setTimeout(startCountdown, 1000)
      }
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('無法存取相機，請確保已授予相機權限')
  }
}

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

function capturePhoto() {
  if (!videoElement.value) return

  const video = videoElement.value
  const videoW = video.videoWidth
  const videoH = video.videoHeight
  const videoRatio = videoW / videoH
  const rect = video.getBoundingClientRect()
  const displayRatio = rect.width / rect.height

  let sx
  let sy
  let sWidth
  let sHeight

  if (videoRatio > displayRatio) {
    sHeight = videoH
    sWidth = sHeight * displayRatio
    sy = 0
    sx = (videoW - sWidth) / 2
  } else {
    sWidth = videoW
    sHeight = sWidth / displayRatio
    sx = 0
    sy = (videoH - sHeight) / 2
  }

  const canvas = document.createElement('canvas')
  canvas.width = sWidth
  canvas.height = sHeight

  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  capturedImage.value = canvas.toDataURL('image/jpeg', 0.95)
  cameraState.value = 'captured'
  emit('captured', capturedImage.value)

  stopCamera()
}

function retakePhoto() {
  cameraState.value = 'idle'
  capturedImage.value = ''
  startCamera()
}

async function nextStep() {
  cameraState.value = 'loading'

  const response = await fetch(capturedImage.value)
  const blob = await response.blob()
  const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })

  setTimeout(() => {
    emit('generate', file)
  }, 2000)
}

function stopCamera() {
  if (!stream.value) return
  stream.value.getTracks().forEach((track) => track.stop())
  stream.value = null
}

function goBack() {
  stopCamera()
  emit('back')
}

function goHome() {
  stopCamera()
  emit('home')
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>
