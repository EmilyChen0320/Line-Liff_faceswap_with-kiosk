<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70" @click="close"></div>

    <div class="relative z-10 flex w-[540px] flex-col items-center rounded-[32px] bg-white px-[54px] pb-[42px] pt-[54px] text-[#202020]">
      <h3 class="text-center text-[34px] font-bold leading-none">掃描 QR Code</h3>

      <div class="mt-[42px] flex h-[260px] w-[260px] items-center justify-center bg-white">
        <div ref="qrcodeContainer"></div>
      </div>

      <div v-if="showUrl" class="mt-4 break-all rounded bg-gray-100 p-3 text-xs text-[#666]">
        {{ qrcodeUrl }}
      </div>

      <p class="mt-[38px] text-center text-[26px] font-bold leading-[1.35]">
        掃描後可在手機瀏覽器<br />
        開啟並儲存圖片
      </p>

      <button type="button" class="mt-[46px] w-[390px] border-0 bg-transparent p-0" @click="close" @touchend.prevent="close">
        <img :src="imageUrls.enterprise.closeButton" alt="關閉" class="block w-full select-none" draggable="false" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  showUrl: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const qrcodeContainer = ref(null)

const qrcodeUrl = computed(() => {
  if (!props.imageUrl) return ''
  const imageUrl = new URL(props.imageUrl, window.location.origin).href
  const downloadUrl = new URL(window.location.pathname, window.location.origin)
  downloadUrl.searchParams.set('step', 'download')
  downloadUrl.searchParams.set('imageUrl', imageUrl)
  return downloadUrl.href
})

function applyGradientToCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#9995F8')
  gradient.addColorStop(1, '#BF21FB')

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const tempCtx = tempCanvas.getContext('2d')

  tempCtx.fillStyle = gradient
  tempCtx.fillRect(0, 0, canvas.width, canvas.height)
  const gradientData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < data.length; i += 4) {
    const isDarkPixel = data[i] < 128 && data[i + 1] < 128 && data[i + 2] < 128
    if (isDarkPixel) {
      data[i] = gradientData.data[i]
      data[i + 1] = gradientData.data[i + 1]
      data[i + 2] = gradientData.data[i + 2]
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

watch(() => props.isVisible, async (newVal) => {
  if (!newVal || !qrcodeUrl.value) return

  await nextTick()
  if (!qrcodeContainer.value) return

  qrcodeContainer.value.innerHTML = ''

  try {
    const canvas = await QRCode.toCanvas(qrcodeUrl.value, {
      width: 250,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    applyGradientToCanvas(canvas)
    canvas.style.borderRadius = '0'
    qrcodeContainer.value.appendChild(canvas)
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
})

function close() {
  emit('close')
}
</script>
