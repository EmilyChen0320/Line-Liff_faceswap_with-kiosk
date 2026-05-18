<template>
  <EnterpriseInnerLayout :current-step="4" @home="restart">
    <div class="flex max-h-[780px] max-w-[640px] items-center justify-center overflow-hidden rounded-[28px] border-[10px] border-black bg-white">
      <img
        v-if="generatedImageUrl"
        :src="generatedImageUrl"
        alt="生成圖片"
        class="block max-h-[760px] max-w-[620px] select-none"
        draggable="false"
      />
      <div v-else class="text-center text-4xl text-[#202020]">尚未取得生成圖片</div>
    </div>

    <div class="mt-[100px] grid w-[720px] grid-cols-2 gap-9">
      <button type="button" class="border-0 bg-transparent p-0" @click="restart" @touchend.prevent="restart">
        <img :src="imageUrls.enterprise.restartButton" alt="重新開始" class="block w-full select-none" draggable="false" />
      </button>
      <button type="button" class="border-0 bg-transparent p-0" @click="showQrCode" @touchend.prevent="showQrCode">
        <img :src="imageUrls.enterprise.downloadButton" alt="下載圖片" class="block w-full select-none" draggable="false" />
      </button>
    </div>

    <QRCodeModal
      :is-visible="isQrVisible"
      :image-url="generatedImageUrl"
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
