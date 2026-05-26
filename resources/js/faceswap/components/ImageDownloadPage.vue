<template>
  <main class="min-h-screen overscroll-none bg-white px-5 py-8 font-noto-sans-tc text-black">
    <div class="mx-auto flex min-h-[calc(100vh-64px)] max-w-[520px] flex-col items-center justify-center gap-6">
      <div class="flex w-full items-center justify-center overflow-hidden rounded-[28px] border-[10px] border-black bg-white">
        <a
          v-if="imageUrl"
          :href="imageUrl"
          target="_blank"
          rel="noopener"
          class="block w-full [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
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
        src="/images/test.png"
        alt="LINE 外部瀏覽器操作示範"
        class="block h-auto w-full"
        draggable="false"
      />

      <section v-else class="w-full text-center">
        <p class="text-[20px] font-bold leading-[1.45]">
          {{ primaryMessage }}
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
})

const userAgent = navigator.userAgent || ''
const isLineWebView = /Line\//i.test(userAgent)

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
    element.style.backgroundColor = '#ffffff'
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
