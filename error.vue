<template>
  <div></div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const statusCode = props.error.statusCode || '500';
const isNotFound = statusCode === '404';

onMounted(() => {
  useToast().clear();
  useToast().open({
    title: isNotFound ? '존재하지 않는 페이지' : '오류',
    msg: isNotFound
      ? `삭제되었거나 존재하지 않는 페이지입니다.\n${props.error.url}`
      : `오류가 발생하였습니다.\n${props.error.message}`,
    type: isNotFound ? 'warning' : 'error',
  });
  clearError({ redirect: '/' });
});
</script>
