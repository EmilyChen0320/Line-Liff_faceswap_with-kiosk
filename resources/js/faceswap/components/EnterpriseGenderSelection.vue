<template>
  <div :class="['enterprise-page', isKioskMode ? 'enterprise-page-kiosk' : 'enterprise-page-mobile']">
    <div class="enterprise-bg" :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"></div>

    <main class="enterprise-content">
      <img :src="imageUrls.enterprise.logo" alt="2026 企業日" class="enterprise-logo" draggable="false" />

      <section class="enterprise-panel">
        <img :src="imageUrls.enterprise.panel" alt="" class="enterprise-panel-bg" draggable="false" />
        <div class="enterprise-panel-inner">
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

.enterprise-page-kiosk .enterprise-logo {
  width: 580px;
  margin-top: 82px;
}

.enterprise-page-kiosk .enterprise-panel {
  height: 1220px;
  margin-top: 38px;
}

.enterprise-page-kiosk .enterprise-panel-inner {
  padding: 150px 92px 110px;
}

.enterprise-page-kiosk .gender-grid {
  width: 100%;
  gap: 36px;
}

.enterprise-page-kiosk .next-button {
  width: 630px;
  margin-top: auto;
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
  padding: 76px 28px 58px;
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
