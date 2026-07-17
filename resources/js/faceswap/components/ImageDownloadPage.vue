<template>
  <main class="relative min-h-screen overflow-hidden bg-black font-noto-sans-tc text-[#1f1f1f]">
    <img
      :src="imageUrls.enterprise.background"
      alt=""
      class="absolute inset-0 h-full w-full select-none object-cover"
      draggable="false"
    />
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="relative z-10 flex min-h-screen w-full justify-center px-4 py-6">
      <div class="relative mx-auto w-full max-w-[420px]">
        <img
          :src="panelBackgroundImage"
          alt=""
          class="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
          draggable="false"
        />

        <div
          class="relative flex w-full flex-col items-center px-5 pb-8 pt-7"
          :class="isLineWebView ? 'gap-5' : 'gap-6'"
        >
          <div
            class="flex items-center justify-center overflow-hidden rounded-[28px] border-[10px] border-black bg-black shadow-[0_16px_34px_rgba(0,0,0,0.25)]"
            :class="isLineWebView ? 'w-[84%] max-w-[320px]' : 'w-[88%] max-w-[340px]'"
          >
            <a
              v-if="imageUrl"
              :href="imageUrl"
              target="_blank"
              rel="noopener"
              class="block w-full overflow-hidden rounded-[18px] bg-black [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
            >
              <img
                :src="imageUrl"
                alt="生成結果"
                @contextmenu.stop
                class="block h-auto w-full [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
              />
            </a>
            <div v-else class="px-6 py-16 text-center text-base font-bold text-[#202020]">
              找不到生成圖片
            </div>
          </div>

          <img
            v-if="isLineWebView && imageUrl"
            :src="lineInstructionImage"
            alt="LINE 外部瀏覽器操作示範"
            class="block h-auto w-full max-w-[372px]"
            draggable="false"
          />

          <section v-else class="w-full max-w-[360px] text-center">
            <p class="text-[20px] font-bold leading-[1.45]">
              {{ primaryMessage }}
            </p>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { imageUrls } from '../../config/imageUrls.js'
import lineInstructionImage from '../../../../public/images/test.png'
import panelBackgroundAsset from '../../../../public/images/esg-faceswap/Exclude.svg'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
})

const userAgent = navigator.userAgent || ''
const isLineWebView = /Line\//i.test(userAgent)

const panelBackgroundImage = computed(() => panelBackgroundAsset || imageUrls.enterprise.backgroundShadow)

const primaryMessage = computed(() => {
  if (!props.imageUrl) return '圖片網址無效'
  return '請長按圖片儲存'
})

const backgroundTargets = []

onMounted(() => {
  backgroundTargets.push(
    document.documentElement,
    document.body,
    document.getElementById('vue-root'),
  )

  backgroundTargets.forEach((element) => {
    if (!element) return
    element.dataset.previousBackgroundColor = element.style.backgroundColor
    element.style.backgroundColor = '#000000'
  })
})

onBeforeUnmount(() => {
  backgroundTargets.forEach((element) => {
    if (!element) return
    element.style.backgroundColor = element.dataset.previousBackgroundColor || ''
    delete element.dataset.previousBackgroundColor
  })
})
</script>
