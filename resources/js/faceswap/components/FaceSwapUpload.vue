<template>
  <EnterpriseInnerLayout :current-step="3" @home="goHome">
    <button
      class="upload-box"
      type="button"
      @click="triggerFileUpload"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <img
        v-if="uploadedImagePreview"
        :src="uploadedImagePreview"
        :alt="uploadedImage?.name || '上傳圖片預覽'"
        class="preview-image"
      />
      <div v-else class="upload-placeholder">
        <img :src="imageUrls.upload" alt="" draggable="false" />
        <span>點擊上傳圖片</span>
        <small>支援 JPG、PNG、WEBP，10MB 以下</small>
      </div>
    </button>

    <div class="upload-note">
      請使用單人清晰正面照，避免多人合照、遮擋五官或低解析度圖片。
    </div>

    <button
      class="generate-button"
      type="button"
      :disabled="!uploadedImage || isGenerating"
      @click="generate"
      @touchend.prevent="generate"
    >
      <img :src="generateButtonImage" alt="下一步" draggable="false" />
    </button>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      class="hidden"
      @change="handleFileSelect"
    />

    <div v-if="isGenerating" class="loading-overlay">
      <div class="loading-card">
        <EnterpriseLoadingAnimation class="loading-animation" />
        <p>圖片生成中，請稍候</p>
      </div>
    </div>
  </EnterpriseInnerLayout>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'
import EnterpriseInnerLayout from './EnterpriseInnerLayout.vue'
import EnterpriseLoadingAnimation from './EnterpriseLoadingAnimation.vue'

const props = defineProps({
  isGenerating: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['home', 'generate'])

const uploadedImage = ref(null)
const uploadedImagePreview = ref('')
const fileInput = ref(null)

const generateButtonImage = computed(() => {
  return uploadedImage.value ? imageUrls.enterprise.nextFocusSmall : imageUrls.enterprise.nextDisabledSmall
})

function triggerFileUpload() {
  fileInput.value?.click()
}

function setUploadedFile(file) {
  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    alert('請上傳 JPG、PNG 或 WEBP 圖片')
    return
  }

  if (file.size > maxSize) {
    alert('圖片大小不可超過 10MB')
    return
  }

  if (uploadedImagePreview.value) {
    URL.revokeObjectURL(uploadedImagePreview.value)
  }

  uploadedImage.value = file
  uploadedImagePreview.value = URL.createObjectURL(file)
}

function handleFileSelect(event) {
  setUploadedFile(event.target.files?.[0])
}

function handleDrop(event) {
  setUploadedFile(event.dataTransfer.files?.[0])
}

function generate() {
  if (!uploadedImage.value || props.isGenerating) return
  emit('generate', uploadedImage.value)
}

function goHome() {
  emit('home')
}

onUnmounted(() => {
  if (uploadedImagePreview.value) {
    URL.revokeObjectURL(uploadedImagePreview.value)
  }
})
</script>

<style scoped>
.upload-box {
  width: 100%;
  overflow: hidden;
  border: 3px dashed rgba(37, 37, 37, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  touch-action: manipulation;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #161616;
}

.upload-placeholder {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #242424;
  text-align: center;
}

.upload-placeholder img {
  width: 92px;
  height: auto;
}

.upload-placeholder span {
  font-size: 20px;
}

.upload-placeholder small {
  font-size: 13px;
}

.upload-note {
  color: #252525;
  line-height: 1.65;
  text-align: center;
}

.generate-button {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.generate-button:disabled {
  cursor: default;
}

.generate-button img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.58);
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  color: #202020;
  text-align: center;
}

.loading-animation {
  width: 150px;
  height: 150px;
}

:global(.enterprise-page-kiosk) .upload-box {
  max-width: 640px;
  height: 720px;
}

:global(.enterprise-page-kiosk) .upload-note {
  max-width: 640px;
  margin-top: 30px;
  font-size: 26px;
}

:global(.enterprise-page-kiosk) .generate-button {
  width: 630px;
  margin-top: auto;
}

:global(.enterprise-page-kiosk) .loading-card {
  width: 420px;
  min-height: 330px;
  gap: 20px;
  font-size: 30px;
}

:global(.enterprise-page-mobile) .upload-box {
  height: 250px;
}

:global(.enterprise-page-mobile) .upload-note {
  margin-top: 18px;
  font-size: 14px;
}

:global(.enterprise-page-mobile) .generate-button {
  width: 260px;
  margin-top: auto;
}

:global(.enterprise-page-mobile) .loading-card {
  width: 260px;
  min-height: 210px;
  gap: 16px;
  font-size: 18px;
}
</style>
