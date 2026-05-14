<template>
  <div :class="['enterprise-page', isKioskMode ? 'enterprise-page-kiosk' : 'enterprise-page-mobile']">
    <div class="enterprise-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>

    <button class="back-button" type="button" @click="goHome" @touchend.prevent="goHome">
      <img :src="imageUrls.enterprise.backIcon" alt="" draggable="false" />
      <img :src="imageUrls.enterprise.backText" alt="回首頁" draggable="false" />
    </button>

    <main class="enterprise-content">
      <img :src="imageUrls.enterprise.logo" alt="2026 企業日" class="enterprise-logo" draggable="false" />

      <section class="enterprise-panel">
        <img :src="imageUrls.enterprise.panel" alt="" class="enterprise-panel-bg" draggable="false" />
        <div class="enterprise-panel-inner">
          <div class="step-indicator">
            <span class="step-num">步驟 1/4</span>
            <span class="step-name">選擇性別</span>
          </div>
          <div class="gender-grid">
            <button
              v-for="gender in ENTERPRISE_GENDERS"
              :key="gender.id"
              class="asset-button"
              type="button"
              @click="selectGender(gender.id)"
              @touchend.prevent="selectGender(gender.id)"
            >
              <img
                :src="selectedGender === gender.id ? gender.selectedImage : gender.defaultImage"
                :alt="gender.name"
                draggable="false"
              />
            </button>
          </div>

          <button
            class="next-button"
            type="button"
            :disabled="!selectedGender"
            @click="nextStep"
            @touchend.prevent="nextStep"
          >
            <img :src="nextButtonImage" alt="下一步" draggable="false" />
          </button>
        </div>
      </section>
    </main>

    <img :src="imageUrls.enterprise.footer" alt="" class="enterprise-footer" draggable="false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'
import { ENTERPRISE_GENDERS } from '@/config/enterpriseDay'

const props = defineProps({
  isKioskMode: {
    type: Boolean,
    default: false,
  },
  initialGender: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['next-step', 'home'])

const selectedGender = ref(props.initialGender)

const nextButtonImage = computed(() => {
  if (props.isKioskMode) {
    return selectedGender.value ? imageUrls.enterprise.nextFocusLarge : imageUrls.enterprise.nextDisabledLarge
  }

  return selectedGender.value ? imageUrls.enterprise.nextFocusSmall : imageUrls.enterprise.nextDisabledSmall
})

function selectGender(genderId) {
  selectedGender.value = genderId
}

function nextStep() {
  if (!selectedGender.value) return
  emit('next-step', { selectedGender: selectedGender.value })
}

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

.enterprise-bg,
.enterprise-footer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.enterprise-bg {
  background-size: cover;
  background-position: center;
}

.enterprise-footer {
  top: auto;
  height: auto;
  z-index: 1;
}

.enterprise-content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
}

.enterprise-logo {
  object-fit: contain;
  user-select: none;
}

.enterprise-panel {
  position: relative;
  width: min(88%, 960px);
}

.enterprise-panel-bg {
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

.gender-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.back-button {
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

.back-button img {
  display: block;
  user-select: none;
}

.asset-button,
.next-button {
  display: block;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.asset-button img,
.next-button img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

.next-button:disabled {
  cursor: default;
}

.enterprise-page-kiosk {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  min-width: 1080px;
  min-height: 1920px;
}

.enterprise-page-kiosk .enterprise-content {
  min-height: 1920px;
}

.enterprise-page-kiosk .back-button {
  left: 70px;
  top: 68px;
  gap: 14px;
}

.enterprise-page-kiosk .back-button img:first-child {
  width: 56px;
}

.enterprise-page-kiosk .back-button img:last-child {
  width: 168px;
}

.enterprise-page-kiosk .enterprise-logo {
  width: 580px;
  margin-top: 82px;
}

.enterprise-page-kiosk .enterprise-panel {
  height: 1220px;
  margin-top: 38px;
}

.enterprise-page-kiosk .enterprise-panel-inner {
  padding: 90px 92px 110px;
}

.enterprise-page-kiosk .step-indicator {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.enterprise-page-kiosk .step-num {
  display: inline-block;
  font-size: 38px;
  line-height: 32px;
  color: #888888;
  transform: skewX(-4deg);
}

.enterprise-page-kiosk .step-name {
  display: inline-block;
  font-size: 58px;
  line-height: 50px;
  color: #222222;
  font-weight: 700;
  transform: skewX(-6deg) scaleY(0.99);
}

.enterprise-page-kiosk .gender-grid {
  width: 100%;
  gap: 36px;
}

.enterprise-page-kiosk .next-button {
  width: 630px;
  margin-top: auto;
}

.enterprise-page-mobile .back-button {
  left: 18px;
  top: 22px;
  gap: 6px;
}

.enterprise-page-mobile .back-button img:first-child {
  width: 28px;
}

.enterprise-page-mobile .back-button img:last-child {
  width: 84px;
}

.enterprise-page-mobile .enterprise-logo {
  width: 230px;
  margin-top: 34px;
}

.enterprise-page-mobile .enterprise-panel {
  width: min(92%, 370px);
  height: 580px;
  margin-top: 18px;
}

.enterprise-page-mobile .enterprise-panel-inner {
  padding: 50px 28px 58px;
}

.enterprise-page-mobile .step-indicator {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  width: 100%;
  margin-bottom: 6px;
}

.enterprise-page-mobile .step-num {
  display: inline-block;
  font-size: 14px;
  line-height: 1;
  color: #888888;
  transform: skewX(-4deg);
}

.enterprise-page-mobile .step-name {
  display: inline-block;
  font-size: 20px;
  line-height: 1;
  color: #222222;
  font-weight: 700;
  transform: skewX(-6deg);
}

.enterprise-page-mobile .gender-grid {
  width: 100%;
  gap: 14px;
}

.enterprise-page-mobile .next-button {
  width: 260px;
  margin-top: auto;
}
</style>
