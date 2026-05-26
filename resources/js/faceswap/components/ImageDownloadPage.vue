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
      </section>
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

const primaryMessage = computed(() => {
  if (!props.imageUrl) return '圖片網址無效'
  return '長按圖片可儲存'
})
</script>
