<template>
  <div :class="['enterprise-page', isKioskMode ? 'enterprise-page-kiosk' : 'enterprise-page-mobile']">
    <div class="enterprise-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>

    <main class="enterprise-content">
      <section class="enterprise-panel">
        <img :src="imageUrls.enterprise.panel" alt="" class="enterprise-panel-bg" draggable="false" />

        <button class="home-button" type="button" @click="goHome" @touchend.prevent="goHome">
          <img :src="imageUrls.enterprise.backIcon" alt="" draggable="false" />
          <img :src="imageUrls.enterprise.backText" alt="回首頁" draggable="false" />
        </button>

        <img :src="imageUrls.enterprise.logo" alt="2026 企業日" class="enterprise-logo" draggable="false" />

        <div class="enterprise-panel-inner">
          <div class="step-indicator">
            <span class="step-num">步驟 {{ currentStep }}/4</span>
            <span class="step-name">{{ currentStepLabel }}</span>
          </div>

          <slot />
        </div>
      </section>
    </main>

    <img :src="imageUrls.enterprise.footer" alt="" class="enterprise-footer" draggable="false" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  isKioskMode: {
    type: Boolean,
    default: false,
  },
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

const currentStepLabel = computed(() => steps.find(s => s.id === props.currentStep)?.label ?? '')

function goHome() {
  emit('home')
}
</script>

<style scoped>
.enterprise-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
  color: #1f1f1f;
}

.enterprise-page-kiosk {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  min-width: 1080px;
  min-height: 1920px;
}

.enterprise-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.enterprise-footer {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
}

.enterprise-content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

.enterprise-panel {
  position: relative;
}

.enterprise-panel-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  user-select: none;
}

.enterprise-panel-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-button {
  position: absolute;
  z-index: 4;
  display: flex;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.home-button img,
.enterprise-logo {
  display: block;
  user-select: none;
}

.step-indicator {
  display: flex;
  align-items: flex-end;
}

.step-num {
  display: inline-block;
  color: #888888;
  transform: skewX(-4deg);
}

.step-name {
  display: inline-block;
  color: #222222;
  font-weight: 700;
  transform: skewX(-6deg) scaleY(0.99);
}

.enterprise-page-kiosk .enterprise-content {
  width: 1080px;
  min-height: 1920px;
  padding-top: 174px;
  justify-content: flex-start;
}

.enterprise-page-kiosk .enterprise-panel {
  width: 960px;
  height: 1503px;
}

.enterprise-page-kiosk .enterprise-logo {
  position: absolute;
  z-index: 4;
  right: 54px;
  top: -76px;
  width: 420px;
}

.enterprise-page-kiosk .home-button {
  left: 54px;
  top: 58px;
  gap: 12px;
}

.enterprise-page-kiosk .home-button img:first-child {
  width: 56px;
}

.enterprise-page-kiosk .home-button img:last-child {
  width: 168px;
}

.enterprise-page-kiosk .enterprise-panel-inner {
  padding: 104px 78px 86px;
}

.enterprise-page-kiosk .step-indicator {
  gap: 10px;
  margin-bottom: 54px;
}

.enterprise-page-kiosk .step-num {
  font-size: 38px;
  line-height: 32px;
}

.enterprise-page-kiosk .step-name {
  font-size: 58px;
  line-height: 50px;
}

.enterprise-page-mobile .enterprise-content {
  padding-top: 78px;
  justify-content: flex-start;
}

.enterprise-page-mobile .enterprise-panel {
  width: min(92%, 382px);
  height: 640px;
}

.enterprise-page-mobile .enterprise-logo {
  position: absolute;
  z-index: 4;
  right: 24px;
  top: -30px;
  width: 158px;
}

.enterprise-page-mobile .home-button {
  left: 22px;
  top: 24px;
  gap: 5px;
}

.enterprise-page-mobile .home-button img:first-child {
  width: 26px;
}

.enterprise-page-mobile .home-button img:last-child {
  width: 78px;
}

.enterprise-page-mobile .enterprise-panel-inner {
  padding: 56px 24px 42px;
}

.enterprise-page-mobile .step-indicator {
  gap: 5px;
  margin-bottom: 18px;
}

.enterprise-page-mobile .step-num {
  font-size: 13px;
  line-height: 1;
}

.enterprise-page-mobile .step-name {
  font-size: 19px;
  line-height: 1;
}
</style>
