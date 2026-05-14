<template>
  <div :class="['enterprise-page', isKioskMode ? 'enterprise-page-kiosk' : 'enterprise-page-mobile']">
    <div class="enterprise-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>

    <button class="back-button" type="button" @click="goHome" @touchend.prevent="goHome">
      <img :src="imageUrls.enterprise.backIcon" alt="" draggable="false" />
      <img :src="imageUrls.enterprise.backText" alt="返回" draggable="false" />
    </button>

    <main class="enterprise-content">
      <img :src="imageUrls.enterprise.logo" alt="2026 企業日" class="enterprise-logo" draggable="false" />

      <section class="enterprise-panel">
        <img :src="imageUrls.enterprise.panel" alt="" class="enterprise-panel-bg" draggable="false" />
        <div class="enterprise-panel-inner">
          <div class="template-grid">
            <button
              v-for="template in ENTERPRISE_TEMPLATES"
              :key="template.id"
              class="asset-button"
              type="button"
              @click="selectTemplate(template.id)"
              @touchend.prevent="selectTemplate(template.id)"
            >
              <img :src="getTemplateImage(template)" :alt="template.name" draggable="false" />
            </button>
          </div>

          <button
            class="next-button"
            type="button"
            :disabled="!selectedTemplate"
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
import { ENTERPRISE_TEMPLATES } from '@/config/enterpriseDay'

const props = defineProps({
  selectedGender: {
    type: String,
    required: true,
  },
  isKioskMode: {
    type: Boolean,
    default: false,
  },
  initialTemplate: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['next-step', 'home'])

const selectedTemplate = ref(props.initialTemplate)

const nextButtonImage = computed(() => {
  if (props.isKioskMode) {
    return selectedTemplate.value ? imageUrls.enterprise.nextFocusLarge : imageUrls.enterprise.nextDisabledLarge
  }

  return selectedTemplate.value ? imageUrls.enterprise.nextFocusSmall : imageUrls.enterprise.nextDisabledSmall
})

function selectTemplate(templateId) {
  selectedTemplate.value = templateId
}

function getTemplateImage(template) {
  const genderImages = template.images[props.selectedGender] || template.images.female
  return selectedTemplate.value === template.id ? genderImages.selected : genderImages.default
}

function nextStep() {
  if (!selectedTemplate.value) return
  emit('next-step', { selectedTemplate: selectedTemplate.value })
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
}

.enterprise-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.enterprise-footer {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
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

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.asset-button,
.next-button,
.back-button {
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

.back-button {
  position: absolute;
  z-index: 4;
  display: flex;
  align-items: center;
}

.back-button img {
  display: block;
  user-select: none;
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
  width: min(88%, 960px);
  height: 1380px;
  margin-top: 38px;
}

.enterprise-page-kiosk .enterprise-panel-inner {
  padding: 92px 120px 92px;
}

.enterprise-page-kiosk .template-grid {
  width: 100%;
  gap: 18px 22px;
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
  margin-top: 62px;
}

.enterprise-page-mobile .enterprise-panel {
  width: min(92%, 370px);
  height: 650px;
  margin-top: 18px;
}

.enterprise-page-mobile .enterprise-panel-inner {
  padding: 58px 36px 44px;
}

.enterprise-page-mobile .template-grid {
  width: 100%;
  gap: 8px 10px;
}

.enterprise-page-mobile .next-button {
  width: 260px;
  margin-top: auto;
}
</style>
