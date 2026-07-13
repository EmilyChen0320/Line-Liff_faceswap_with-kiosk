<template>
  <ImageDownloadPage
    v-if="currentStep === 'download'"
    :image-url="downloadImageUrl"
  />

  <div v-else class="min-h-screen w-screen overflow-auto bg-black font-noto-sans-tc">
    <div class="flex min-h-screen items-start justify-center">
      <div :style="previewFrameStyle" class="relative shrink-0">
        <div
          :style="kioskStageStyle"
          class="relative h-[1920px] w-[1080px] origin-top-left overflow-hidden bg-black"
        >
          <EnterpriseGenderSelection
            v-if="currentStep === 'gender-selection'"
            :initial-gender="selectedGender"
            @next-step="handleGenderSelection"
            @home="handleRestart"
          />

          <FaceSwapCameraCapture
            v-if="currentStep === 'upload'"
            :selected-template="selectedTemplate"
            :selected-character="''"
            :generation-progress="generationProgress"
            :generation-status="generationStatus"
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
import FaceSwapCameraCapture from './components/FaceSwapCameraCapture.vue'
import FaceSwapResult from './components/FaceSwapResult.vue'
import ImageDownloadPage from './components/ImageDownloadPage.vue'
import { aliImageStudioService } from '../services/aliImageStudioService.js'
import {
  ESG_FACE_SWAP_TEMPLATE_ID,
  findEnterpriseTemplateApiId,
  getConfiguredEnterpriseTemplateApiId,
} from '../config/enterpriseDay.js'
import { imageUrls } from '../config/imageUrls.js'

const KIOSK_WIDTH = 1080
const KIOSK_HEIGHT = 1920

const taskId = ref('')
const currentStep = ref('gender-selection')
const selectedGender = ref('')
const selectedTemplate = ref(ESG_FACE_SWAP_TEMPLATE_ID)
const generatedImageUrl = ref('')
const downloadImageUrl = ref('')
const isGenerating = ref(false)
const generationProgress = ref(0)
const generationStatus = ref('idle')
const templateApiIdCache = new Map()
let generationProgressTimer = null
const previewScale = ref(1)

const previewFrameStyle = computed(() => ({
  width: KIOSK_WIDTH * previewScale.value + 'px',
  height: KIOSK_HEIGHT * previewScale.value + 'px',
}))

const kioskStageStyle = computed(() => ({
  transform: 'scale(' + previewScale.value + ')',
}))

function updatePreviewScale() {
  const widthScale = window.innerWidth / KIOSK_WIDTH
  const heightScale = window.innerHeight / KIOSK_HEIGHT
  previewScale.value = Math.min(widthScale, heightScale, 1)
}

function initializeApp() {
  const urlParams = new URLSearchParams(window.location.search)
  const stepParam = urlParams.get('step')
  const imageUrlParam = urlParams.get('imageUrl')
  const testTaskId = urlParams.get('taskId')
  const validSteps = ['gender-selection', 'upload', 'result', 'download']

  currentStep.value = validSteps.includes(stepParam) ? stepParam : 'gender-selection'
  selectedGender.value = ''
  selectedTemplate.value = ESG_FACE_SWAP_TEMPLATE_ID
  generatedImageUrl.value = ''
  downloadImageUrl.value = ''
  generationStatus.value = 'idle'
  taskId.value = ''

  if (currentStep.value === 'download') {
    downloadImageUrl.value = imageUrlParam || ''
    return
  }

  if (currentStep.value === 'result') {
    taskId.value = testTaskId || 'test-task-preview'
    selectedGender.value = 'female'
    selectedTemplate.value = ESG_FACE_SWAP_TEMPLATE_ID
    generatedImageUrl.value = imageUrls.profile
  }
}

onMounted(() => {
  if (currentStep.value === 'download') return

  updatePreviewScale()
  window.addEventListener('resize', updatePreviewScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePreviewScale)
  clearGenerationProgress()
})

initializeApp()

function handleGenderSelection(data) {
  selectedGender.value = data.selectedGender
  selectedTemplate.value = ESG_FACE_SWAP_TEMPLATE_ID
  generationStatus.value = 'idle'
  generationProgress.value = 0
  currentStep.value = 'upload'
}

function handleCameraCapture(imageFile) {
  console.log('camera captured', imageFile)
}

async function handleCameraGenerate(imageFile) {
  await generateEnterpriseImage(imageFile)
}

function startGenerationProgress() {
  clearGenerationProgress()
  generationProgress.value = 8
  generationProgressTimer = window.setInterval(() => {
    if (generationProgress.value < 65) {
      generationProgress.value += 4
      return
    }

    if (generationProgress.value < 90) {
      generationProgress.value += 1
    }
  }, 650)
}

function finishGenerationProgress() {
  generationProgress.value = 100
  clearGenerationProgress()
}

function clearGenerationProgress() {
  if (!generationProgressTimer) return
  window.clearInterval(generationProgressTimer)
  generationProgressTimer = null
}

async function resolveTemplateApiId() {
  const cacheKey = `${selectedTemplate.value}:${selectedGender.value}`
  if (templateApiIdCache.has(cacheKey)) {
    return templateApiIdCache.get(cacheKey)
  }

  const templates = await aliImageStudioService.getTemplates()
  const templateApiId = findEnterpriseTemplateApiId(templates, selectedGender.value)
    || getConfiguredEnterpriseTemplateApiId(selectedTemplate.value, selectedGender.value)

  if (!templateApiId) {
    const genderLabel = selectedGender.value === 'male' ? '男生' : '女生'
    throw new Error(`找不到 ${genderLabel} 的 ESG 合影模板，請確認後端模板名稱或 template id`)
  }

  templateApiIdCache.set(cacheKey, templateApiId)
  return templateApiId
}

async function generateEnterpriseImage(imageFile) {
  try {
    isGenerating.value = true
    generationStatus.value = 'loading'
    startGenerationProgress()
    const templateApiId = await resolveTemplateApiId()
    const result = await aliImageStudioService.generateFromTemplate(templateApiId, imageFile)
    finishGenerationProgress()
    generationStatus.value = 'success'
    generatedImageUrl.value = result.outputUrl
    taskId.value = String(result.id || '')
    currentStep.value = 'result'
  } catch (error) {
    console.error('ESG 合影生圖失敗:', error)
    clearGenerationProgress()
    generationProgress.value = 0
    generationStatus.value = 'failed'
    alert('生成失敗：' + (error.message || '請重新再試'))
    currentStep.value = 'upload'
  } finally {
    isGenerating.value = false
  }
}

function handleRestart() {
  currentStep.value = 'gender-selection'
  taskId.value = ''
  selectedGender.value = ''
  selectedTemplate.value = ESG_FACE_SWAP_TEMPLATE_ID
  generatedImageUrl.value = ''
  isGenerating.value = false
  generationProgress.value = 0
  generationStatus.value = 'idle'
  clearGenerationProgress()
}

function goBack() {
  if (currentStep.value === 'gender-selection') {
    currentStep.value = 'gender-selection'
  } else if (currentStep.value === 'upload') {
    currentStep.value = 'gender-selection'
  } else if (currentStep.value === 'result') {
    currentStep.value = 'upload'
  }
}
</script>
