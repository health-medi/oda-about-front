<template>
  <div>
    <h1 class="text-lg font-bold" v-if="title">{{ title }}</h1>
    <p class="text-sm whitespace-pre-wrap">{{ msg }}</p>
  </div>
</template>

<script setup>
defineProps({
  /**
   * 제목
   */
  title: {
    type: String,
  },
  /**
   * 메세지
   */
  msg: {
    type: String,
    required: true,
  },
});
</script>
