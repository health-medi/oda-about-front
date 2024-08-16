<template>
  <label for="" class="pr-2 text-sm whitespace-nowrap">
    {{ text }}
    <span class="text-danger-500" v-if="required">*</span>
    <template v-if="desc">
      <br /><span class="text-xs font-light text-gray-400">{{ desc }}</span>
    </template>
  </label>
</template>

<script setup>
const props = defineProps({
  /**
   * 텍스트
   */
  text: {
    type: String,
  },
  /**
   * 텍스트
   */
  desc: {
    type: String,
  },
  /**
   * 필수 여부
   */
  required: {
    type: Boolean,
    default() {
      return false;
    },
  },
});
</script>
