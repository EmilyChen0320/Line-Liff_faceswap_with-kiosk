<template>
  <!-- 表單頁面（獨立頁面，不依賴裝置模式） -->
  <FormPage v-if="showFormPage" />
  
  <!-- 根據裝置模式切換不同的容器樣式 -->
  <div v-else :class="appContainerClass">
    <!-- ==================== Mobile 模式 ==================== -->
    <template v-if="!isKioskMode">
      <!-- Mobile 模式：外層黑色全螢幕容器，內層固定 414px 寬度 -->
      <div class="mobile-wrapper">
        <div class="mobile-content">
          <!-- Face Swap Homepage -->
          <FaceSwapHomepage
            v-if="currentStep === 'faceswap-home'"
            @enter-face-swap="enterFaceSwap"
          />

          <EnterpriseGenderSelection
            v-if="currentStep === 'gender-selection'"
            :initialGender="selectedGender"
            @next-step="handleGenderSelection"
            @home="handleRestart"
          />

          <EnterpriseTemplateSelection
            v-if="currentStep === 'template-selection'"
            :selectedGender="selectedGender"
            :initialTemplate="selectedTemplate"
            @next-step="handleTemplateSelection"
            @home="handleRestart"
          />

          <FaceSwapUpload
            v-if="currentStep === 'upload'"
            :selectedTemplate="selectedTemplate"
            :selectedGender="selectedGender"
            :isGenerating="isGenerating"
            @home="handleRestart"
            @generate="handleGenerate"
          />

          <FaceSwapResult
            v-if="currentStep === 'result'"
            :generatedImageUrl="generatedImageUrl"
            @restart="handleRestart"
          />
        </div>
      </div>
    </template>

    <!-- ==================== Kiosk 模式 (1080x1920) ==================== -->
    <template v-else>
      <!-- Kiosk Homepage -->
      <KioskHomepage
        v-if="currentStep === 'faceswap-home'"
        @enter-face-swap="enterFaceSwap"
      />

      <EnterpriseGenderSelection
        v-if="currentStep === 'gender-selection'"
        :isKioskMode="true"
        :initialGender="selectedGender"
        @next-step="handleGenderSelection"
        @home="handleRestart"
      />

      <EnterpriseTemplateSelection
        v-if="currentStep === 'template-selection'"
        :selectedGender="selectedGender"
        :isKioskMode="true"
        :initialTemplate="selectedTemplate"
        @next-step="handleTemplateSelection"
        @home="handleRestart"
      />

      <!-- Kiosk Camera Capture (串流服務) -->
      <FaceSwapCameraCapture
        v-if="currentStep === 'upload'"
        :selectedTemplate="selectedTemplate"
        :selectedCharacter="''"
        :isKioskMode="isKioskMode"
        @captured="handleCameraCapture"
        @generate="handleCameraGenerate"
        @back="goBack"
        @home="handleRestart"
      />

      <!-- Kiosk Result -->
      <FaceSwapResult
        v-if="currentStep === 'result'"
        :generatedImageUrl="generatedImageUrl"
        :isKioskMode="true"
        @restart="handleRestart"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import FaceSwapHomepage from './components/FaceSwapHomepage.vue'
import EnterpriseGenderSelection from './components/EnterpriseGenderSelection.vue'
import EnterpriseTemplateSelection from './components/EnterpriseTemplateSelection.vue'
import FaceSwapUpload from './components/FaceSwapUpload.vue'
import FaceSwapCameraCapture from './components/FaceSwapCameraCapture.vue'
import FaceSwapResult from './components/FaceSwapResult.vue'
import FormPage from './components/FormPage.vue'
import { aliImageStudioService } from '../services/aliImageStudioService.js'
import { deviceService } from '../services/deviceService.js'
import { getEnterpriseTemplateApiId } from '../config/enterpriseDay.js'
import { imageUrls } from '../config/imageUrls.js'

// Kiosk 專用組件
import KioskHomepage from './components/kiosk/KioskHomepage.vue'
// import KioskTemplateSelection from './components/kiosk/KioskTemplateSelection.vue'
// import KioskCameraCapture from './components/kiosk/KioskCameraCapture.vue'
// import KioskResult from './components/kiosk/KioskResult.vue'

// 狀態
const taskId = ref('')
const userId = ref('') // 等待裝置服務初始化
const currentStep = ref('faceswap-home') // 初始狀態設定為換臉首頁
const selectedGender = ref('')
const selectedTemplate = ref('')
const generatedImageUrl = ref('')
const isGenerating = ref(false)
const isInitialized = ref(false)
const userUsage = ref(0) // 用戶已生成的圖片數量

// 檢查 URL 參數，如果 to_form=true 則顯示表單頁面
const urlParams = new URLSearchParams(window.location.search)
const toForm = urlParams.get('to_form')
// 支援多種格式：true, True, TRUE, 1
const showFormPage = ref(toForm === 'true' || toForm === 'True' || toForm === 'TRUE' || toForm === '1')

// 調試日誌 - 總是輸出，方便診斷
console.log('🔍 URL 參數檢查:')
console.log('  - 完整 URL:', window.location.href)
console.log('  - 完整 search:', window.location.search)
console.log('  - to_form 參數值:', toForm)
console.log('  - showFormPage 值:', showFormPage.value)
if (toForm) {
  console.log('✅ 檢測到 to_form 參數，將顯示表單頁面')
} else {
  console.log('ℹ️ 未檢測到 to_form 參數，將顯示正常頁面')
}

// 裝置模式: 'kiosk' | 'mobile'
const deviceMode = ref('mobile')

// 保持向後兼容，isPCMode 現在改為 isKioskMode
const isKioskMode = ref(false)
// 保留 isPCMode 作為 isKioskMode 的別名，讓現有組件能正常運作
const isPCMode = isKioskMode

// 根據裝置模式計算容器樣式
const appContainerClass = computed(() => {
  if (isKioskMode.value) {
    // Kiosk 模式：固定 1080x1920 尺寸，置中顯示
    return 'app app-kiosk'
  }
  // Mobile 模式：響應式全螢幕
  return 'app app-mobile'
})

// 裝置初始化函數
function initializeDevice() {
  console.log('🔧 開始初始化裝置服務...')
  
  // 使用裝置服務初始化
  const result = deviceService.initialize({ userId })
  
  if (result.success) {
    deviceMode.value = result.deviceMode
    isKioskMode.value = result.isKiosk
    console.log('✅ 裝置服務初始化完成')
    console.log('  - 裝置模式:', deviceMode.value)
    console.log('  - 用戶 ID:', userId.value)
  }
}

// 偵測裝置模式（保留此函數供組件使用）
function detectDeviceMode() {
  return deviceService.detectDeviceMode()
}

// 主要初始化函數
async function initializeApp() {
  console.log('=== 換臉應用程序初始化開始 ===')

  try {
    // 如果顯示表單頁面，直接返回，不執行其他初始化
    if (showFormPage.value) {
      console.log('📋 表單頁面模式，跳過其他初始化')
      isInitialized.value = true
      console.log('=== 表單模式初始化完成 ===')
      return
    }
    
    // 檢查 URL 參數，用於測試/預覽特定步驟
    const urlParams = new URLSearchParams(window.location.search)
    const stepParam = urlParams.get('step')
    const testTaskId = urlParams.get('taskId')
    
    // 重置所有狀態，確保重整後是乾淨的狀態
    currentStep.value = 'faceswap-home'
    selectedGender.value = ''
    selectedTemplate.value = ''
    generatedImageUrl.value = ''
    taskId.value = ''
    
    // 如果有 URL 參數，設置對應的步驟（用於測試/預覽）
    if (stepParam) {
      console.log('🔍 檢測到 URL 參數 step:', stepParam)
      
      const validSteps = ['faceswap-home', 'gender-selection', 'template-selection', 'upload', 'result']
      if (validSteps.includes(stepParam)) {
        currentStep.value = stepParam
        
        if (stepParam === 'result') {
          taskId.value = testTaskId || 'test-task-preview'
          selectedGender.value = 'female'
          selectedTemplate.value = 'sanliTv'
          generatedImageUrl.value = imageUrls.result
          console.log('📋 測試模式：結果頁，taskId:', taskId.value)
          
          // 測試模式下直接返回，不繼續後續初始化
          isInitialized.value = true
          console.log('=== 測試模式初始化完成 ===')
          return
        }
      }
    }
    
    // 檢查用戶 ID
    if (!userId.value) {
      console.log('用戶 ID 未設置，顯示臉部交換首頁')
      return
    }
    userUsage.value = 0
  } catch (error) {
    console.error('初始化過程發生錯誤:', error)
    // 錯誤時保持首頁狀態
  }
  
  isInitialized.value = true
  console.log('=== 換臉應用程序初始化完成 ===')
}

// 在掛載前執行初始化
onBeforeMount(async () => {
  initializeDevice() // 先初始化裝置服務
  await initializeApp() // 再初始化應用程序
})

// 組件掛載後的額外處理
onMounted(async () => {
  console.log('Vue 組件已掛載，應用當前狀態:', {
    currentStep: currentStep.value,
    userId: userId.value,
    deviceMode: deviceMode.value,
    isKioskMode: isKioskMode.value,
    taskId: taskId.value,
    userUsage: userUsage.value
  })
})

// 進入臉部交換工具
function enterFaceSwap() {
  currentStep.value = 'gender-selection'
}

function handleGenderSelection(data) {
  selectedGender.value = data.selectedGender
  selectedTemplate.value = ''
  currentStep.value = 'template-selection'
}

// 處理模板選擇
function handleTemplateSelection(data) {
  selectedTemplate.value = data.selectedTemplate
  currentStep.value = 'upload'
}

// Handle camera capture (Kiosk mode)
function handleCameraCapture(imageFile) {
  console.log('📷 相機拍照完成', imageFile)
}

// Handle camera generate (Kiosk mode)
async function handleCameraGenerate(imageFile) {
  await generateEnterpriseImage(imageFile)
}

// 處理生成請求
async function handleGenerate(imageFile) {
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
    const templateApiId = getEnterpriseTemplateApiId(selectedTemplate.value)
    console.log('📤 Ali Image Studio 生圖:', {
      templateApiId,
      selectedTemplate: selectedTemplate.value,
      selectedGender: selectedGender.value,
      file: imageFile?.name,
    })

    const result = await aliImageStudioService.generateFromTemplate(templateApiId, imageFile)
    generatedImageUrl.value = result.outputUrl
    taskId.value = String(result.id || '')
    userUsage.value += 1
    currentStep.value = 'result'
  } catch (error) {
    console.error('❌ 企業日生圖失敗:', error)
    alert(`生成失敗：${error.message || '請重新再試'}`)
    if (isKioskMode.value) {
      currentStep.value = 'template-selection'
    }
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

// 返回上一步
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

<style scoped>
.app {
  font-family: 'MonaChaoGangHei', 'Noto Sans TC', sans-serif;
  overflow-x: hidden;
  background-color: #000000;
}

/* Mobile 模式：響應式全螢幕 */
.app-mobile {
  min-height: 100vh;
  width: 100%;
}

/* Mobile 外層容器：全螢幕黑色背景，內容置中 */
.mobile-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  display: flex;
  justify-content: center;
}

/* Mobile 內層容器：固定最大寬度 414px（iPhone 尺寸） */
.mobile-content {
  width: 100%;
  max-width: 414px;
  min-height: 100vh;
  background-color: #000000;
  overflow-x: hidden; /* 防止內容溢出 */
}

/* Kiosk 模式：固定 1080x1920 尺寸 */
.app-kiosk {
  width: 1080px;
  height: 1920px;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
</style>
