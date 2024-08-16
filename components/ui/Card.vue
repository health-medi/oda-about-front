<template>
  <div :class="[bgchange ? 'p-1 bg-[#F3F6F9] md:p-5 rounded-xl' : 'p-1 bg-white md:p-5', ringchange ? 'ring-0' : 'ring-2 ring-[#F3F6F9]']">
  <!-- <div :class="bgchange == true ? 'p-1 bg-[#F3F6F9]  md:p-5 rounded-xl' : 'p-1 bg-white ring-2 ring-[#F3F6F9] md:p-5'"> -->
    <div class="flex justify-between">
      <slot name="title">123123</slot>
    </div>
    <div class="mt-3 ml-1 md:mt-1 md:ml-0">
      <slot name="contents">333</slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  /**
   * 입력값
   */
  bgchange: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * ring change
   */
  ringchange: {
    type: Boolean,
    default() {
      return false;
    },
  },
});
</script>
