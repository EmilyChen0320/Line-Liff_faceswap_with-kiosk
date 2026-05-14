<template>
  <div ref="animationContainer" class="enterprise-loading-animation" aria-hidden="true"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import lottie from 'lottie-web'
import loadingAnimation from '../../../../public/images/照片生成loading.json'

const animationContainer = ref(null)
let animation = null

onMounted(() => {
  if (!animationContainer.value) return

  animation = lottie.loadAnimation({
    container: animationContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
  })
})

onUnmounted(() => {
  animation?.destroy()
  animation = null
})
</script>

<style scoped>
.enterprise-loading-animation {
  width: 100%;
  height: 100%;
}
</style>
