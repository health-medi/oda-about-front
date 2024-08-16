<template>
  <template v-if="value !== null && value !== undefined && value !== ''">
    <NuxtLink :to="link" class="hover:text-blue-500 underline underline-offset-1" v-if="link"
      ><UiValueCommon :value="value"
    /></NuxtLink>
    <UiValueDate :value="value" v-else-if="format === 'date'" />
    <UiValueCurrency :value="value" v-else-if="format === 'currency'" />
    <span class="whitespace-nowrap" v-else>{{ value }}</span>
  </template>
  <span class="text-xs text-gray-400 whitespace-nowrap" v-else>{{ emptyText }}</span>
</template>

<script setup>
defineProps({
  /**
   * 값
   */
  value: {
    type: [Object, String, Number],
  },
  /**
   * 출력 포맷
   */
  format: {
    type: String,
    default: 'text',
    validator: function (value) {
      return ['text', 'date', 'currency'].indexOf(value) !== -1;
    },
  },
  /**
   * 링크
   */
  link: {
    type: String,
  },
  /**
   * 비어있는 링크
   */
  emptyLink: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 비어있을때 기본 출력 값
   */
  emptyText: {
    type: String,
    default() {
      return '(없음)';
    },
  },
});
</script>
