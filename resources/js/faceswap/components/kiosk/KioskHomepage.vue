<template>
  <div class="relative h-full w-full overflow-hidden bg-black font-noto-sans-tc">
    <img
      :src="imageUrls.profile"
      alt="2026 企業日"
      class="h-full w-full cursor-pointer select-none object-cover [touch-action:manipulation]"
      draggable="false"
      @click="enterFaceSwap"
      @touchend.prevent="enterFaceSwap"
    />
  </div>
</template>

<script setup>
import { imageUrls } from '@/config/imageUrls'

const emit = defineEmits(['enter-face-swap'])

function enterFaceSwap() {
  emit('enter-face-swap')
}
</script>
