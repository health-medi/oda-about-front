<template>
  <span class="text-sm whitespace-nowrap">{{ dateStr }}</span>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  /**
   * 값
   */
  value: {
    type: [String, Number],
  },
  /**
   * 포맷
   */
  format: {
    type: String,
    default() {
      return 'YY.MM.DD';
    },
  },
});

const dateStr = computed(() => {
  if (!props.value) {
    return props.value;
  }
  return dayjs(props.value).format(props.format);
});
</script>
