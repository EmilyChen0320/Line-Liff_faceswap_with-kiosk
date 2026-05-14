<template>
  <EnterpriseInnerLayout :is-kiosk-mode="isKioskMode" :current-step="4" @home="restart">
    <div class="result-image-wrap">
      <img
        v-if="generatedImageUrl"
        :src="generatedImageUrl"
        alt="生成圖片"
        class="result-image"
        draggable="false"
      />
      <div v-else class="empty-result">尚未取得生成圖片</div>
    </div>

    <div class="action-row">
      <button type="button" class="asset-button" @click="showQrCode" @touchend.prevent="showQrCode">
        <img :src="imageUrls.enterprise.downloadButton" alt="下載圖片" draggable="false" />
      </button>
      <button type="button" class="asset-button" @click="restart" @touchend.prevent="restart">
        <img :src="imageUrls.enterprise.restartButton" alt="重新開始" draggable="false" />
      </button>
    </div>

    <QRCodeModal
      :is-visible="isQrVisible"
      :image-url="generatedImageUrl"
      :is-kiosk-mode="isKioskMode"
      @close="isQrVisible = false"
    />
  </EnterpriseInnerLayout>
</template>

<script setup>
import { ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'
import EnterpriseInnerLayout from './EnterpriseInnerLayout.vue'
import QRCodeModal from './QRCodeModal.vue'

const props = defineProps({
  generatedImageUrl: {
    type: String,
    default: '',
  },
  isKioskMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['restart'])

const isQrVisible = ref(false)

function showQrCode() {
  if (!props.generatedImageUrl) return
  isQrVisible.value = true
}

function restart() {
  emit('restart')
}
</script>

<style scoped>
.result-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-result {
  color: #202020;
  text-align: center;
}

.action-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.asset-button {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.asset-button img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

:global(.enterprise-page-kiosk) .result-image-wrap {
  width: 640px;
  height: 780px;
}

:global(.enterprise-page-kiosk) .empty-result {
  font-size: 36px;
}

:global(.enterprise-page-kiosk) .action-row {
  width: 720px;
  gap: 36px;
  margin-top: auto;
}

:global(.enterprise-page-mobile) .result-image-wrap {
  width: 292px;
  height: 360px;
}

:global(.enterprise-page-mobile) .empty-result {
  font-size: 18px;
}

:global(.enterprise-page-mobile) .action-row {
  width: 292px;
  gap: 14px;
  margin-top: auto;
}
</style>
