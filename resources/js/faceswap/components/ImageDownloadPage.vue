<template>
  <main class="min-h-screen px-5 py-8 font-noto-sans-tc text-black">
    <div class="mx-auto flex min-h-[calc(100vh-64px)] max-w-[520px] flex-col items-center justify-center gap-6">
      <div class="w-full overflow-hidden rounded-lg bg-transparent">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="生成結果"
          class="block max-h-[68vh] w-full object-contain"
          draggable="false"
        />
        <div v-else class="px-6 py-16 text-center text-base font-bold text-[#202020]">
          找不到生成圖片
        </div>
      </div>

      <section class="w-full text-center">
        <p class="text-[20px] font-bold leading-[1.45]">
          {{ primaryMessage }}
        </p>
        <p class="mt-3 text-[15px] leading-[1.6] text-white/75">
          {{ secondaryMessage }}
        </p>
      </section>

      <button
        v-if="canAttemptDownload"
        type="button"
        class="h-14 w-full rounded-lg bg-white text-[18px] font-bold text-[#202020] active:scale-[0.99]"
        @click="downloadImage"
      >
        下載圖片
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
})

const userAgent = navigator.userAgent || ''
const isAndroidLine = /Android/i.test(userAgent) && /Line\//i.test(userAgent)

const canAttemptDownload = computed(() => Boolean(props.imageUrl) && !isAndroidLine)

const primaryMessage = computed(() => {
  if (!props.imageUrl) return '圖片網址無效'
  if (isAndroidLine) return '請點右上角選單，用外部瀏覽器開啟後下載'
  return '長按圖片可儲存，或點擊下方按鈕下載'
})

const secondaryMessage = computed(() => {
  if (!props.imageUrl) return '請重新掃描 QR Code。'
  if (isAndroidLine) return 'Android LINE 內建瀏覽器可能無法直接下載圖片。'
  return '若下載沒有開始，請長按圖片選擇儲存。'
})

async function downloadImage() {
  if (!props.imageUrl) return

  try {
    const response = await fetch(props.imageUrl, { mode: 'cors' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    triggerDownload(blobUrl)
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch (error) {
    console.warn('Download via fetch failed, falling back to direct image URL:', error)
    triggerDownload(props.imageUrl)
  }
}

function triggerDownload(url) {
  const link = document.createElement('a')
  link.href = url
  link.download = `faceswap-result-${Date.now()}.png`
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
