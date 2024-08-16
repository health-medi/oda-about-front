<template>
  <span class="whitespace-nowrap">{{ currency(value) }}</span>
</template>

<script setup>
import { currency } from '~~/plugins/utils/number.utils';

defineProps({
  /**
   * 값
   */
  value: {
    type: Number,
  },
});
</script>
