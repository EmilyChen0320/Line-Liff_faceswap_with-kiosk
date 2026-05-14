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
          <div class="step-row" aria-label="目前步驟">
            <div
              v-for="step in steps"
              :key="step.id"
              :class="['step-item', step.id === currentStep ? 'is-active' : '', step.id < currentStep ? 'is-done' : '']"
            >
              <span class="step-dot">{{ step.id }}</span>
              <span class="step-label">{{ step.label }}</span>
            </div>
          </div>

          <slot />
        </div>
      </section>
    </main>

    <img :src="imageUrls.enterprise.footer" alt="" class="enterprise-footer" draggable="false" />
  </div>
</template>

<script setup>
import { imageUrls } from '@/config/imageUrls'

defineProps({
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
  { id: 3, label: '拍照生成' },
  { id: 4, label: '下載圖片' },
]

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

.step-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.step-item {
  display: flex;
  align-items: center;
  color: rgba(31, 31, 31, 0.42);
  white-space: nowrap;
}

.step-item:not(:last-child)::after {
  display: block;
  content: '';
  height: 2px;
  background: rgba(31, 31, 31, 0.24);
}

.step-item.is-active,
.step-item.is-done {
  color: #1f1f1f;
}

.step-item.is-active .step-dot {
  background: #1f1f1f;
  color: #fff;
}

.step-item.is-done .step-dot {
  background: rgba(31, 31, 31, 0.78);
  color: #fff;
}

.step-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 2px solid currentColor;
  border-radius: 999px;
  font-weight: 700;
}

.step-label {
  font-weight: 700;
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
  padding: 164px 78px 86px;
}

.enterprise-page-kiosk .step-row {
  margin-bottom: 54px;
  gap: 18px;
}

.enterprise-page-kiosk .step-item {
  gap: 12px;
  font-size: 22px;
}

.enterprise-page-kiosk .step-item:not(:last-child)::after {
  width: 38px;
  margin-left: 18px;
}

.enterprise-page-kiosk .step-dot {
  width: 42px;
  height: 42px;
  font-size: 22px;
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
  padding: 82px 24px 42px;
}

.enterprise-page-mobile .step-row {
  margin-bottom: 24px;
  gap: 6px;
}

.enterprise-page-mobile .step-item {
  gap: 4px;
  font-size: 10px;
}

.enterprise-page-mobile .step-item:not(:last-child)::after {
  width: 8px;
  margin-left: 6px;
}

.enterprise-page-mobile .step-dot {
  width: 20px;
  height: 20px;
  border-width: 1px;
  font-size: 11px;
}
</style>
