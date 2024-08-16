<template>
  <UiDialog>
    <template #title v-if="title">
      {{ title }}
    </template>
    <template #headerButton></template>
    <template #default>
      <div class="mt-4 text-sm" v-html="msg"></div>
    </template>
    <template #footer="{ close, dismiss }">
      <div class="grid grid-cols-2 gap-2">
        <UiButton :text="dismissButtonName" size="md" class="px-7" variant="danger" @click="dismiss()" />
        <UiButton :text="closeButtonName" size="md" class="px-7" variant="success" @click="close()" />
      </div>
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
      return '예';
    },
  },
  /**
   * 취소 버튼 이름
   */
  dismissButtonName: {
    type: String,
    default() {
      return '아니오';
    },
  },
});
</script>
