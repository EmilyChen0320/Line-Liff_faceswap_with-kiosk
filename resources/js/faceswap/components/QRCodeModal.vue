<template>
  <div v-if="isVisible" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/65" @click="close"></div>

    <div :class="['qr-modal', isKioskMode ? 'qr-modal-kiosk' : 'qr-modal-mobile']">
      <div class="text-center">
        <h3>掃描 QR Code 下載圖片</h3>
      </div>

      <div class="flex justify-center">
        <div ref="qrcodeContainer"></div>
      </div>

      <div v-if="showUrl" class="mt-4 p-3 bg-gray-100 rounded text-xs break-all text-[#666]">
        {{ imageUrl }}
      </div>

      <button type="button" class="close-button" @click="close" @touchend.prevent="close">
        <img :src="imageUrls.enterprise.closeButton" alt="關閉" draggable="false" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  showUrl: {
    type: Boolean,
    default: false
  },
  isKioskMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const qrcodeContainer = ref(null)

// Apply gradient effect to QR code canvas
function applyGradientToCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#9995F8')    // 0% - 淺紫色
  gradient.addColorStop(1, '#BF21FB')    // 100% - 亮紫色

  // Create a temporary canvas for gradient
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const tempCtx = tempCanvas.getContext('2d')

  // Fill with gradient
  tempCtx.fillStyle = gradient
  tempCtx.fillRect(0, 0, canvas.width, canvas.height)
  const gradientData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)

  // Apply gradient only to dark pixels (QR code squares)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // If pixel is dark (QR code square), replace with gradient color
    if (r < 128 && g < 128 && b < 128) {
      data[i] = gradientData.data[i]       // R
      data[i + 1] = gradientData.data[i + 1] // G
      data[i + 2] = gradientData.data[i + 2] // B
    }
  }

  // Put the modified image data back
  ctx.putImageData(imageData, 0, 0)
}

// Generate QR code when modal becomes visible
watch(() => props.isVisible, async (newVal) => {
  if (newVal && props.imageUrl) {
    await nextTick()
    if (qrcodeContainer.value) {
      // Clear previous QR code
      qrcodeContainer.value.innerHTML = ''

      try {
        // Generate QR code with solid colors first - scale for PC
        const qrSize = props.isKioskMode ? 520 : 240
        const canvas = await QRCode.toCanvas(props.imageUrl, {
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',  // 純黑色，確保結構正確
            light: '#FFFFFF'  // 純白色背景
          }
        })

        // Apply gradient effect to QR code
        applyGradientToCanvas(canvas)

        // Add rounded corners to QR code - scale for PC
        canvas.style.borderRadius = window.innerWidth >= 1024 ? '16px' : '8px'

        qrcodeContainer.value.appendChild(canvas)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
      }
    }
  }
})

function close() {
  emit('close')
}
</script>

<style scoped>
.qr-modal {
  position: relative;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  color: #202020;
}

.qr-modal h3 {
  font-weight: 700;
}

.close-button {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.close-button img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

.qr-modal-kiosk {
  width: 760px;
  padding: 58px 70px 62px;
  gap: 38px;
}

.qr-modal-kiosk h3 {
  font-size: 38px;
}

.qr-modal-kiosk .close-button {
  width: 420px;
}

.qr-modal-mobile {
  width: min(88vw, 340px);
  padding: 28px 24px 32px;
  gap: 22px;
}

.qr-modal-mobile h3 {
  font-size: 22px;
}

.qr-modal-mobile .close-button {
  width: 238px;
}
</style>
