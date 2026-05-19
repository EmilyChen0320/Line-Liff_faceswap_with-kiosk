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
          <div class="mb-[192px] flex w-full items-end justify-center gap-2.5">
            <span class="inline-block skew-x-[-4deg] text-[38px] leading-8 text-[#888888]">步驟 1/4</span>
            <span class="inline-block scale-y-[0.99] skew-x-[-6deg] text-[58px] font-bold leading-[50px] text-[#222222]">
              選擇性別
            </span>
          </div>

          <div class="flex w-full flex-col items-center gap-[172px]">
            <div class="grid grid-cols-[262px_262px] justify-center gap-x-[152px]">
              <button
                v-for="gender in ENTERPRISE_GENDERS"
                :key="gender.id"
                class="border-0 bg-transparent p-0"
                type="button"
                @click="selectGender(gender.id)"
                @touchend.prevent="selectGender(gender.id)"
              >
                <img
                  :src="selectedGender === gender.id ? gender.selectedImage : gender.defaultImage"
                  :alt="gender.name"
                  class="block w-full select-none"
                  draggable="false"
                />
              </button>
            </div>

            <button
              class="w-[630px] border-0 bg-transparent p-0 disabled:cursor-default"
              type="button"
              :disabled="!selectedGender"
              @click="nextStep"
              @touchend.prevent="nextStep"
            >
              <img :src="nextButtonImage" alt="下一步" class="block w-full select-none" draggable="false" />
            </button>
          </div>
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
import { computed, ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'
import { ENTERPRISE_GENDERS } from '@/config/enterpriseDay'

const props = defineProps({
  initialGender: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['next-step', 'home'])

const selectedGender = ref(props.initialGender)

const nextButtonImage = computed(() => (
  selectedGender.value ? imageUrls.enterprise.nextFocusLarge : imageUrls.enterprise.nextDisabledLarge
))

function selectGender(genderId) {
  selectedGender.value = genderId
}

function nextStep() {
  if (!selectedGender.value) return
  emit('next-step', { selectedGender: selectedGender.value })
}

function goHome() {
  emit('home')
}
</script>
