<template>
  <div class="relative h-full w-full overflow-hidden bg-black text-[#1f1f1f]">
    <img
      :src="imageUrls.enterprise.background"
      alt=""
      class="absolute inset-0 h-full w-full select-none object-cover"
      draggable="false"
    />
    <div class="absolute inset-0 bg-white/5"></div>

    <img
      :src="imageUrls.enterprise.backgroundShadow"
      alt=""
      class="absolute left-[15px] top-[206px] z-10 h-[1630px] w-[1050px] select-none"
      draggable="false"
    />

    <img
      :src="imageUrls.enterprise.badge"
      alt="與戰地阿特合影"
      class="absolute left-[547px] top-[150px] z-30 h-[126px] w-[490px] select-none object-contain"
      draggable="false"
    />

    <h1
      class="absolute left-[230px] top-[438px] z-30 w-[620px] text-center text-[52px] font-extrabold leading-[56px] tracking-[2px] text-white [text-shadow:0_0_10px_rgba(0,0,0,0.25)]"
    >步驟1：選擇性別
    </h1>

    <button
      class="absolute left-[156px] top-[617px] z-30 border-0 bg-transparent p-0 [touch-action:manipulation]"
      type="button"
      @click="selectGender('male')"
      @touchend.prevent="selectGender('male')"
    >
      <img
        :src="imageUrls.enterprise.gender.male.photo"
        alt="男生"
        class="h-[507px] w-[330px] select-none object-contain"
        draggable="false"
      />
    </button>

    <button
      class="absolute left-[594px] top-[617px] z-30 border-0 bg-transparent p-0 [touch-action:manipulation]"
      type="button"
      @click="selectGender('female')"
      @touchend.prevent="selectGender('female')"
    >
      <img
        :src="imageUrls.enterprise.gender.female.photo"
        alt="女生"
        class="h-[507px] w-[330px] select-none object-contain"
        draggable="false"
      />
    </button>

    <button
      class="absolute left-[156px] top-[1188px] z-30 h-[126px] w-[330px] border-0 bg-transparent p-0 [touch-action:manipulation]"
      type="button"
      @click="selectGender('male')"
      @touchend.prevent="selectGender('male')"
    >
      <img
        :src="selectedGender === 'male' ? imageUrls.enterprise.gender.male.selected : imageUrls.enterprise.gender.male.default"
        alt="男生"
        class="h-full w-full select-none object-contain"
        draggable="false"
      />
    </button>

    <button
      class="absolute left-[594px] top-[1188px] z-30 h-[126px] w-[330px] border-0 bg-transparent p-0 [touch-action:manipulation]"
      type="button"
      @click="selectGender('female')"
      @touchend.prevent="selectGender('female')"
    >
      <img
        :src="selectedGender === 'female' ? imageUrls.enterprise.gender.female.selected : imageUrls.enterprise.gender.female.default"
        alt="女生"
        class="h-full w-full select-none object-contain"
        draggable="false"
      />
    </button>

    <button
      class="absolute left-[98px] top-[1647px] z-30 flex h-[118px] w-[884px] items-center justify-center rounded-[36px] border border-[#bde5ce] bg-[linear-gradient(105deg,rgba(245,255,245,0.94),rgba(194,243,255,0.86),rgba(255,255,255,0.9))] text-[42px] font-black text-[#36A030] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md disabled:opacity-55 [touch-action:manipulation]"
      type="button"
      :disabled="!selectedGender"
      @click="nextStep"
      @touchend.prevent="nextStep"
    >
      下一步
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { imageUrls } from '@/config/imageUrls'

const props = defineProps({
  initialGender: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['next-step'])

const selectedGender = ref(props.initialGender)

function selectGender(genderId) {
  selectedGender.value = genderId
}

function nextStep() {
  if (!selectedGender.value) return
  emit('next-step', { selectedGender: selectedGender.value })
}
</script>
