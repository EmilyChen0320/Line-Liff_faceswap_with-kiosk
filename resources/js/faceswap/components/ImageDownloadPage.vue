<template>
  <div class="relative h-full w-full overflow-hidden bg-black text-[#1f1f1f]">
    <div
      class="pointer-events-none absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"
    ></div>

    <main class="relative z-10 flex h-full flex-col items-center px-[76px] pb-[128px] pt-[140px]">
      <img
        :src="imageUrls.enterprise.logo"
        alt="2026 企業日"
        class="w-[470px] select-none object-contain"
        draggable="false"
      />

      <section class="mt-[72px] flex w-full flex-1 flex-col items-center rounded-[28px] bg-white px-[58px] py-[64px]">
        <template v-if="hasImage">
          <h1 class="text-center text-[58px] font-bold leading-none text-[#202020]">下載生成圖片</h1>

          <div class="mt-[52px] flex h-[760px] w-full items-center justify-center overflow-hidden rounded-[20px] border-[8px] border-black bg-[#f7f7f7]">
            <img
              :src="imageUrl"
              alt="生成圖片"
              class="block max-h-full max-w-full select-auto object-contain"
              draggable="false"
            />
          </div>

          <div
            v-if="isAndroidLine"
            class="mt-[46px] w-full rounded-[18px] bg-[#f2f2f2] px-[32px] py-[28px] text-center text-[30px] font-bold leading-[1.45] text-[#202020]"
          >
            Android LINE 內可能無法長按下載，請點右上角選單，選擇以外部瀏覽器開啟後下載。
          </div>

          <div class="mt-auto grid w-full grid-cols-1 gap-5 pt-[44px]">
            <button
              type="button"
              class="h-[96px] rounded-full border-[6px] border-black bg-[#fff35c] text-[36px] font-bold leading-none text-black shadow-[0_8px_0_#000]"
              @click="downloadImage"
            >
              下載圖片
            </button>

            <button
              v-if="isLineBrowser"
              type="button"
              class="h-[84px] rounded-full border-[5px] border-black bg-white text-[30px] font-bold leading-none text-black"
              @click="openImage"
            >
              開啟圖片
            </button>

            <button
              type="button"
              class="h-[84px] rounded-full border-[5px] border-black bg-white text-[30px] font-bold leading-none text-black"
              @click="copyImageUrl"
            >
              {{ copyButtonText }}
            </button>
          </div>
        </template>

        <template v-else>
          <h1 class="text-center text-[56px] font-bold leading-tight text-[#202020]">無法取得圖片</h1>
          <p class="mt-[42px] text-center text-[34px] font-bold leading-[1.45] text-[#444444]">
            下載連結可能已失效，請回到活動頁重新生成圖片。
          </p>
          <button
            type="button"
            class="mt-auto h-[96px] w-full rounded-full border-[6px] border-black bg-[#fff35c] text-[36px] font-bold leading-none text-black shadow-[0_8px_0_#000]"
            @click="goHome"
          >
            回到首頁
          </button>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['home'])

const copyButtonText = ref('複製圖片連結')
const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent

const hasImage = computed(() => Boolean(props.imageUrl))
const isAndroid = computed(() => /Android/i.test(userAgent))
const isLineBrowser = computed(() => /Line\//i.test(userAgent))
const isAndroidLine = computed(() => isAndroid.value && isLineBrowser.value)

function buildFilename() {
  return `faceswap-result-${Date.now()}.jpg`
}

async function downloadImage() {
  if (!props.imageUrl) return

  try {
    const response = await fetch(props.imageUrl, {
      mode: 'cors',
      credentials: 'omit',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = buildFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.warn('圖片下載失敗，改為開啟圖片 URL:', error)
    openImage()
  }
}

function openImage() {
  if (!props.imageUrl) return
  window.location.href = props.imageUrl
}

async function copyImageUrl() {
  if (!props.imageUrl) return

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.imageUrl)
    } else {
      const input = document.createElement('input')
      input.value = props.imageUrl
      input.setAttribute('readonly', 'readonly')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }

    copyButtonText.value = '已複製連結'
    window.setTimeout(() => {
      copyButtonText.value = '複製圖片連結'
    }, 1800)
  } catch (error) {
    console.warn('複製圖片連結失敗:', error)
    copyButtonText.value = '複製失敗，請開啟圖片'
    window.setTimeout(() => {
      copyButtonText.value = '複製圖片連結'
    }, 1800)
  }
}

function goHome() {
  emit('home')
}
</script>
