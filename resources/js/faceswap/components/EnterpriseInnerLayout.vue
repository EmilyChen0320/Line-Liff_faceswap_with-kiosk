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
          <div class="mb-[92px] flex w-full items-end justify-center gap-2.5">
            <span class="inline-block skew-x-[-4deg] text-[38px] leading-8 text-[#888888]">
              步驟 {{ currentStep }}/4
            </span>
            <span class="inline-block scale-y-[0.99] skew-x-[-6deg] text-[58px] font-bold leading-[50px] text-[#222222]">
              {{ currentStepLabel }}
            </span>
          </div>

          <slot />
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
import { computed } from 'vue'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['home'])

const steps = [
  { id: 1, label: '選擇性別' },
  { id: 2, label: '選擇主題' },
  { id: 3, label: '拍攝照片' },
  { id: 4, label: '生成結果' },
]

const currentStepLabel = computed(() => steps.find((step) => step.id === props.currentStep)?.label ?? '')

function goHome() {
  emit('home')
}
</script>
