<template>
  <span class="whitespace-nowrap">{{ getName(type, value) }}</span>
</template>

<script setup>
/**
 * 코드
 */
const { getName } = await useCode();

defineProps({
  /**
   * 값
   */
  value: {
    type: String,
  },
  /**
   * 코드 유형
   */
  type: {
    type: String,
    required: true,
  },
});
</script>
