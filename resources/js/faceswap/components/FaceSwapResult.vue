<template>
  <EnterpriseInnerLayout :current-step="3" @home="restart">
    <div class="flex max-h-[780px] max-w-[640px] items-center justify-center overflow-hidden rounded-[28px]  bg-white">
      <img
        v-if="generatedImageUrl"
        :src="generatedImageUrl"
        alt="生成圖片"
        class="block max-h-[760px] max-w-[620px] select-none"
        draggable="false"
      />
      <div v-else class="text-center text-4xl text-[#202020]">尚未取得生成圖片</div>
    </div>

    <div class="mt-[60px] grid w-[902px] grid-cols-2 gap-[43px]">
      <button
        type="button"
        class="flex h-[118px] items-center justify-center rounded-[36px] border border-[#7bcaa6] bg-[linear-gradient(105deg,rgba(245,255,245,0.94),rgba(194,243,255,0.86),rgba(255,255,255,0.9))] text-[42px] font-black text-[#36A030] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md [touch-action:manipulation]"
        @click="restart"
        @touchend.prevent="restart"
      >
        重新開始
      </button>
      <button
        type="button"
        class="flex h-[118px] items-center justify-center rounded-[36px] border border-[#7bcaa6] bg-[linear-gradient(105deg,rgba(245,255,245,0.94),rgba(194,243,255,0.86),rgba(255,255,255,0.9))] text-[42px] font-black text-[#36A030] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md [touch-action:manipulation]"
        @click="showQrCode"
        @touchend.prevent="showQrCode"
      >
        下載圖片
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
