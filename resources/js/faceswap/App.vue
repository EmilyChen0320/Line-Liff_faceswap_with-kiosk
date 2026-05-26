<template>
  <div class="min-h-screen w-screen overflow-auto bg-black font-noto-sans-tc">
    <div class="flex min-h-screen items-start justify-center">
      <div :style="previewFrameStyle" class="relative shrink-0">
        <div
          :style="kioskStageStyle"
          class="relative h-[1920px] w-[1080px] origin-top-left overflow-hidden bg-black"
        >
          <KioskHomepage
            v-if="currentStep === 'faceswap-home'"
            @enter-face-swap="enterFaceSwap"
          />

          <EnterpriseGenderSelection
            v-if="currentStep === 'gender-selection'"
            :initial-gender="selectedGender"
            @next-step="handleGenderSelection"
            @home="handleRestart"
          />

          <EnterpriseTemplateSelection
            v-if="currentStep === 'template-selection'"
            :selected-gender="selectedGender"
            :initial-template="selectedTemplate"
            @next-step="handleTemplateSelection"
            @home="handleRestart"
          />

          <FaceSwapCameraCapture
            v-if="currentStep === 'upload'"
            :selected-template="selectedTemplate"
            :selected-character="''"
            @captured="handleCameraCapture"
            @generate="handleCameraGenerate"
            @back="goBack"
            @home="handleRestart"
          />

          <FaceSwapResult
            v-if="currentStep === 'result'"
            :generated-image-url="generatedImageUrl"
            @restart="handleRestart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import EnterpriseGenderSelection from './components/EnterpriseGenderSelection.vue'
import EnterpriseTemplateSelection from './components/EnterpriseTemplateSelection.vue'
import FaceSwapCameraCapture from './components/FaceSwapCameraCapture.vue'
import FaceSwapResult from './components/FaceSwapResult.vue'
import KioskHomepage from './components/kiosk/KioskHomepage.vue'
import { aliImageStudioService } from '../services/aliImageStudioService.js'
import { getEnterpriseTemplateApiId } from '../config/enterpriseDay.js'
import { imageUrls } from '../config/imageUrls.js'

const KIOSK_WIDTH = 1080
const KIOSK_HEIGHT = 1920

const taskId = ref('')
const currentStep = ref('faceswap-home')
const selectedGender = ref('')
const selectedTemplate = ref('')
const generatedImageUrl = ref('')
const isGenerating = ref(false)
const previewScale = ref(1)

const previewFrameStyle = computed(() => ({
  width: `${KIOSK_WIDTH * previewScale.value}px`,
  height: `${KIOSK_HEIGHT * previewScale.value}px`,
}))

const kioskStageStyle = computed(() => ({
  transform: `scale(${previewScale.value})`,
}))

function updatePreviewScale() {
  const widthScale = window.innerWidth / KIOSK_WIDTH
  const heightScale = window.innerHeight / KIOSK_HEIGHT
  previewScale.value = Math.min(widthScale, heightScale, 1)
}

function initializeApp() {
  const urlParams = new URLSearchParams(window.location.search)
  const stepParam = urlParams.get('step')
  const testTaskId = urlParams.get('taskId')
  const validSteps = ['faceswap-home', 'gender-selection', 'template-selection', 'upload', 'result']

  currentStep.value = validSteps.includes(stepParam) ? stepParam : 'faceswap-home'
  selectedGender.value = ''
  selectedTemplate.value = ''
  generatedImageUrl.value = ''
  taskId.value = ''

  if (currentStep.value === 'result') {
    taskId.value = testTaskId || 'test-task-preview'
    selectedGender.value = 'female'
    selectedTemplate.value = 'sanliTv'
    generatedImageUrl.value = imageUrls.profile
  }
}

onMounted(() => {
  updatePreviewScale()
  window.addEventListener('resize', updatePreviewScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePreviewScale)
})

initializeApp()

function enterFaceSwap() {
  currentStep.value = 'gender-selection'
}

function handleGenderSelection(data) {
  selectedGender.value = data.selectedGender
  selectedTemplate.value = ''
  currentStep.value = 'template-selection'
}

function handleTemplateSelection(data) {
  selectedTemplate.value = data.selectedTemplate
  currentStep.value = 'upload'
}

function handleCameraCapture(imageFile) {
  console.log('camera captured', imageFile)
}

async function handleCameraGenerate(imageFile) {
  await generateEnterpriseImage(imageFile)
}

async function generateEnterpriseImage(imageFile) {
  if (!selectedTemplate.value) {
    alert('請先選擇 IP')
    currentStep.value = 'template-selection'
    return
  }

  try {
    isGenerating.value = true
    const templateApiId = getEnterpriseTemplateApiId(selectedTemplate.value, selectedGender.value)
    const result = await aliImageStudioService.generateFromTemplate(templateApiId, imageFile)
    generatedImageUrl.value = result.outputUrl
    taskId.value = String(result.id || '')
    currentStep.value = 'result'
  } catch (error) {
    console.error('企業日生圖失敗:', error)
    alert(`生成失敗：${error.message || '請重新再試'}`)
    currentStep.value = 'template-selection'
  } finally {
    isGenerating.value = false
  }
}

function handleRestart() {
  currentStep.value = 'faceswap-home'
  taskId.value = ''
  selectedGender.value = ''
  selectedTemplate.value = ''
  generatedImageUrl.value = ''
  isGenerating.value = false
}

function goBack() {
  if (currentStep.value === 'gender-selection') {
    currentStep.value = 'faceswap-home'
  } else if (currentStep.value === 'template-selection') {
    currentStep.value = 'gender-selection'
  } else if (currentStep.value === 'upload') {
    currentStep.value = 'template-selection'
  } else if (currentStep.value === 'result') {
    currentStep.value = 'upload'
  }
}
</script>
