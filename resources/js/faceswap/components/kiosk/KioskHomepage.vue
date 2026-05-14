<template>
  <div class="relative w-full h-full min-h-screen bg-black overflow-hidden">
    <img
      :src="imageUrls.profile"
      alt="2026 企業日"
      class="w-full h-full min-h-screen object-cover cursor-pointer select-none"
      style="touch-action: manipulation;"
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

<style scoped>
/* 確保 Kiosk 模式下的字體和樣式 */
div {
  font-family: 'Noto Sans TC', 'Inter', sans-serif;
}
</style>
