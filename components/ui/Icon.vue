<template>
  <span :class="`mdi ${icon}`" :style="size > 0 ? `font-size: ${size}px;` : ''"></span>
</template>

<script setup>
defineProps({
  /**
   * 아이콘 이름
   */
  icon: {
    type: String,
  },
  /**
   * 아이콘 사이즈
   */
  size: {
    type: [String, Number],
  },
});
</script>
