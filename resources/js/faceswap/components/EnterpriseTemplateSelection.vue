<template>
  <div class="relative h-full w-full overflow-hidden bg-black text-[#1f1f1f]">
    <div
      class="pointer-events-none absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${imageUrls.enterprise.background})` }"
    ></div>

    <main class="relative z-10 flex h-full flex-col items-center">
      <section class="relative mt-[160px] h-[1503px] w-[960px]">
        <img
          :src="imageUrls.enterprise.panel"
          alt=""
          class="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-fill"
          draggable="false"
        />

        <button
          class="absolute left-4 top-[42px] z-40 border-0 bg-transparent p-0"
          type="button"
          @click="goHome"
          @touchend.prevent="goHome"
        >
          <img :src="imageUrls.enterprise.backToHome" alt="回首頁" class="block w-[170px] select-none" draggable="false" />
        </button>

        <img
          :src="imageUrls.enterprise.logo"
          alt="2026 企業日"
          class="pointer-events-none absolute -top-[76px] right-[-16px] z-20 w-[470px] select-none object-contain"
          draggable="false"
        />

        <div class="relative z-30 flex h-full flex-col items-center px-[92px] pb-[110px] pt-[150px]">
          <div class="mb-[62px] flex w-full items-end justify-center gap-2.5">
            <span class="inline-block skew-x-[-4deg] text-[38px] leading-8 text-[#888888]">步驟 2/4</span>
            <span class="inline-block scale-y-[0.99] skew-x-[-6deg] text-[58px] font-bold leading-[50px] text-[#222222]">
              選擇主題
            </span>
          </div>

          <div class="grid h-[952px] w-fit grid-cols-2 gap-x-[124px] gap-y-[60px]">
            <button
              v-for="template in ENTERPRISE_TEMPLATES"
              :key="template.id"
              class="h-[467px] w-[260px] border-0 bg-transparent p-0"
              type="button"
              @click="selectTemplate(template.id)"
              @touchend.prevent="selectTemplate(template.id)"
            >
              <img
                :src="getTemplateImage(template)"
                :alt="template.name"
                class="block h-full w-full select-none object-contain"
                draggable="false"
              />
            </button>
          </div>

          <button
            class="mt-auto inline-flex self-end items-center justify-center gap-4 rounded-full border-[6px] border-black bg-[#fff35c] px-20 py-4 text-[36px] font-bold leading-none text-black shadow-[0_8px_0_#000] disabled:bg-[#d9d9d9] disabled:text-black disabled:cursor-default"
            type="button"
            :disabled="!selectedTemplate"
            @click="nextStep"
            @touchend.prevent="nextStep"
          >
            <span>下一步</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>

    <img
      :src="imageUrls.enterprise.footer"
      alt=""
      class="pointer-events-none absolute inset-x-0 bottom-0 z-50 w-full select-none"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'
import { ENTERPRISE_TEMPLATES } from '@/config/enterpriseDay'

const props = defineProps({
  selectedGender: {
    type: String,
    required: true,
  },
  initialTemplate: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['next-step', 'home'])

const selectedTemplate = ref(props.initialTemplate)

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
