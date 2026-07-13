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
      步驟{{ currentStep }}：{{ currentStepLabel }}
    </h1>

    <main class="absolute left-[89px] top-[543px] z-30 flex w-[902px] flex-col items-center">
      <slot />
    </main>
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
  { id: 2, label: '拍攝照片' },
  { id: 3, label: '完成' },
]

const currentStepLabel = computed(() => steps.find((step) => step.id === props.currentStep)?.label ?? '')

function goHome() {
  emit('home')
}
</script>
