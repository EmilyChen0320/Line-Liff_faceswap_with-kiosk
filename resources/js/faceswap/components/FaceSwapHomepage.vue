<template>
  <div class="relative w-full min-h-screen bg-black overflow-hidden">
    <img
      :src="imageUrls.profile"
      alt="2026 企業日"
      class="w-full min-h-screen object-cover cursor-pointer select-none"
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
