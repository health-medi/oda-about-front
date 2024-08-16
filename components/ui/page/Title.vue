<template>
  <h1 class="text-4xl font-bold text-center">
    <slot v-if="!!slots.default"></slot>
    <template v-else>{{ text }}</template>
  </h1>
</template>

<script setup>
const props = defineProps({
  /**
   * 출력 텍스트
   */
  text: {
    type: String,
  },
});

const slots = useSlots();
</script>
