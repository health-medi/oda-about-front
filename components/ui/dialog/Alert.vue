<template>
  <UiDialog>
    <template #title v-if="title">
      {{ title }}
    </template>
    <template #headerButton></template>
    <template #default>
      <div class="mt-4 text-sm" v-html="msg"></div>
    </template>
    <template #footer="{ close }">
      <UiButton :text="closeButtonName" size="md" class="px-7" variant="primary" block @click="close()" />
    </template>
  </UiDialog>
</template>

<script setup>
const props = defineProps({
  /**
   * 메세지
   */
  msg: {
    type: String,
    required: true,
  },
  /**
   * 제목
   */
  title: {
    type: String,
  },
  /**
   * 닫기 버튼 이름
   */
  closeButtonName: {
    type: String,
    default() {
      return '확인';
    },
  },
});
</script>
