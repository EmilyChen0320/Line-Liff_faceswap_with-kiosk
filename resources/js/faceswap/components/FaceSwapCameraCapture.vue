<template>
  <div class="relative h-full w-full overflow-hidden bg-black text-[#1f1f1f]">
    <img :src="imageUrls.enterprise.background" alt="" class="absolute inset-0 h-full w-full select-none object-cover" draggable="false" />
    <div class="absolute inset-0 bg-black/10"></div>

    <img :src="imageUrls.enterprise.setLogo" alt="三立集團" class="absolute left-[28px] top-[28px] z-20 w-[295px] select-none" draggable="false" />
    <img :src="imageUrls.enterprise.setFutureLogo" alt="SET FUTURE" class="absolute right-[28px] top-[28px] z-20 w-[304px] select-none" draggable="false" />

    <img :src="imageUrls.enterprise.backgroundShadow" alt="" class="absolute left-[15px] top-[206px] z-10 h-[1630px] w-[1050px] select-none" draggable="false" />

    <button
      class="absolute left-[72px] top-[266px] z-30 flex h-[40px] items-center gap-[12px] border-0 bg-transparent p-0 text-[40px] font-bold text-white [touch-action:manipulation]"
      type="button"
      aria-label="返回"
      @click="goHome"
      @touchend.prevent="goHome"
    >
      <img :src="imageUrls.enterprise.backIcon" alt="" class="h-[40px] w-[40px] select-none object-contain" draggable="false" />
      <span class="whitespace-nowrap leading-[40px]">回首頁</span>
    </button>

    <img
      :src="imageUrls.enterprise.badge"
      alt="與戰地阿特合影"
      class="absolute left-[547px] top-[150px] z-30 h-[126px] w-[490px] select-none object-contain"
      draggable="false"
    />

    <h1 class="absolute left-[230px] top-[438px] z-30 w-[620px] text-center text-[52px] font-extrabold leading-[56px] tracking-[2px] text-white [text-shadow:0_0_10px_rgba(0,0,0,0.25)]">
      步驟２：拍攝照片
    </h1>

    <div class="absolute left-[188px] top-[543px] z-30 h-[691px] w-[703px] overflow-hidden rounded-[24px] bg-[#d9d9d9] shadow-[0_16px_34px_rgba(0,0,0,0.25)]">
      <img
        v-if="cameraState === 'preview' || cameraState === 'countdown'"
        :src="imageUrls.enterprise.cameraFrame"
        alt=""
        class="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 select-none object-contain"
        draggable="false"
      />
      <div v-if="cameraState === 'idle'" class="relative h-full w-full bg-white/88">
        <img
          :src="imageUrls.enterprise.cameraFrame"
          alt=""
          class="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-65"
          draggable="false"
        />
        <div class="absolute inset-x-0 bottom-[46px] z-10 text-center text-[28px] font-bold text-[#1f1f1f]">
          正在開啟相機...
        </div>
      </div>

      <div v-if="cameraState === 'loading'" class="relative h-full w-full bg-white/80">
        <video
          :src="imageUrls.enterprise.loadingVideo"
          class="absolute inset-0 h-full w-full select-none object-cover"
          autoplay
          loop
          muted
          playsinline
        />
        <div class="absolute inset-x-0 bottom-[46px] z-10 text-center text-[28px] font-bold text-[#1f1f1f]">
  
        </div>
      </div>

      <video
        v-if="cameraState === 'preview' || cameraState === 'countdown'"
        ref="videoElement"
        class="h-full w-full scale-x-[-1] object-cover"
        autoplay
        playsinline
      />

      <div v-if="cameraState === 'countdown'" class="absolute inset-0 flex items-center justify-center bg-black/45">
        <div class="animate-pulse text-[200px] font-black leading-none text-white">{{ countdownNumber }}</div>
      </div>

      <img
        v-if="cameraState === 'captured'"
        :src="capturedImage"
        class="h-full w-full object-cover"
        alt="Captured photo"
        draggable="false"
      />

    </div>

    <div v-if="cameraState === 'loading'" class="absolute left-[188px] top-[1280px] z-30 w-[703px]">
      <div class="flex items-center gap-[22px]">
        <div class="h-[26px] flex-1 overflow-hidden rounded-full border-2 border-white/80 bg-white/70 shadow-inner">
          <div
            class="h-full rounded-full bg-[linear-gradient(90deg,#8fcf79,#5ec4d8,#36A030)] transition-[width] duration-500 ease-out"
            :style="{ width: displayGenerationProgress + '%' }"
          ></div>
        </div>
        <div class="w-[82px] text-right text-[28px] font-extrabold leading-[40px] text-[#36A030]">
          {{ displayGenerationProgress }}%
        </div>
      </div>
      <div class="mt-[34px] text-center text-[32px] font-extrabold leading-[45px] text-[#1f1f1f]">圖片生成中，請稍候</div>
    </div>

    <div v-if="cameraState === 'countdown'" class="absolute left-[109px] top-[1318px] z-30 w-[861px] text-center text-[36px] font-black leading-[68px] text-[#1f1f1f]">
      <p>請在五秒內確認你的位置</p>
      <p>並保持畫面內僅有一人</p>
      <p>五官清晰無遮擋</p>
    </div>

    <template v-if="cameraState !== 'countdown' && cameraState !== 'loading'">
      <button
        v-if="cameraState !== 'captured'"
        :class="cameraState === 'preview' ? 'left-[89px]' : 'left-1/2 -translate-x-1/2'"
        class="absolute top-[1310px] z-50 flex h-[118px] w-[429px] items-center justify-center rounded-[36px] border border-[#7bcaa6] bg-[linear-gradient(105deg,rgba(245,255,245,0.94),rgba(194,243,255,0.86),rgba(255,255,255,0.9))] text-[42px] font-black text-[#36A030] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md [touch-action:manipulation]"
        type="button"
        @click="goBack"
        @touchend.prevent="goBack"
      >
        重新選擇
      </button>
      <button
        v-if="cameraState === 'preview'"
        class="absolute left-[561px] top-[1310px] z-50 h-[118px] w-[429px] border-0 bg-transparent p-0 [touch-action:manipulation]"
        type="button"
        @click="startCountdown"
        @touchend.prevent="startCountdown"
      >
        <img
          :src="imageUrls.enterprise.buttons.confirmPhotoNext"
          alt="下一步"
          class="h-full w-full select-none object-contain"
          draggable="false"
        />
      </button>
      <button
        v-if="cameraState === 'captured'"
        class="absolute left-[89px] top-[1294px] z-50 flex h-[118px] w-[429px] items-center justify-center rounded-[36px] border border-[#7bcaa6] bg-[linear-gradient(105deg,rgba(245,255,245,0.94),rgba(194,243,255,0.86),rgba(255,255,255,0.9))] text-[42px] font-black text-[#36A030] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md [touch-action:manipulation]"
        type="button"
        @click="retakePhoto"
        @touchend.prevent="retakePhoto"
      >
        重新拍照
      </button>
      <button
        v-if="cameraState === 'captured'"
        class="absolute left-[561px] top-[1294px] z-50 h-[118px] w-[429px] border-0 bg-transparent p-0 [touch-action:manipulation]"
        type="button"
        @click="nextStep"
        @touchend.prevent="nextStep"
      >
        <img
          :src="imageUrls.enterprise.buttons.confirmPhotoNext"
          alt="下一步"
          class="h-full w-full select-none object-contain"
          draggable="false"
        />
      </button>
    </template>

    <div
      v-if="cameraState !== 'captured' && cameraState !== 'countdown' && cameraState !== 'loading'"
      class="absolute left-[98px] top-[1490px] z-30 w-[884px] text-left text-[28px] font-bold leading-[59px] text-[#1f1f1f]"
    >
      <div>點擊後會有5秒準備期，請在秒數內擺好姿勢</div>
      <div>請保持單人在畫面內，避免多人以利辨識</div>
      <div>請確保臉部五官完整可見，避免口罩、手部、頭髮等遮擋</div>
      <div>請勿晃動，以免因照片模糊而影響生成品質</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { imageUrls } from '../../config/imageUrls.js'

const props = defineProps({
  selectedTemplate: {
    type: String,
    default: '',
  },
  selectedCharacter: {
    type: String,
    default: '',
  },
  generationProgress: {
    type: Number,
    default: 0,
  },
  generationStatus: {
    type: String,
    default: 'idle',
  },
})

const emit = defineEmits(['captured', 'generate', 'back', 'home'])

const cameraState = ref('idle')
const videoElement = ref(null)
const capturedImage = ref('')
const countdownNumber = ref(5)
const stream = ref(null)

const displayGenerationProgress = computed(() => Math.max(0, Math.min(100, Math.round(props.generationProgress))))

watch(
  () => props.generationStatus,
  (status) => {
    if (status === 'failed' && cameraState.value === 'loading') {
      cameraState.value = 'captured'
    }
  },
)

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
