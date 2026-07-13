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

      <button
        type="button"
        class="relative mt-[46px] flex h-[97px] w-[480px] items-center justify-center border-0 bg-transparent p-0 text-[36px] font-black text-[#36A030] [touch-action:manipulation]"
        @click="close"
        @touchend.prevent="close"
      >
        <img
          :src="imageUrls.enterprise.qrModalButton"
          alt=""
          class="absolute inset-0 h-full w-full select-none object-fill"
          draggable="false"
        />
        <span class="relative z-10">關閉</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { imageUrls } from '../../config/imageUrls.js'

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
  const qrCodeBaseURL = window.endpoint?.qrCodeBaseURL || window.location.origin
  const downloadUrl = new URL('/', qrCodeBaseURL)
  downloadUrl.searchParams.set('step', 'download')
  downloadUrl.searchParams.set('imageUrl', new URL(props.imageUrl, window.location.origin).href)
  return downloadUrl.href
})

watch(() => props.isVisible, async (newVal) => {
  if (!newVal || !qrcodeUrl.value) return

  await nextTick()
  if (!qrcodeContainer.value) return

  qrcodeContainer.value.innerHTML = ''

  try {
    const canvas = await QRCode.toCanvas(qrcodeUrl.value, {
      width: 260,
      margin: 3,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

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
