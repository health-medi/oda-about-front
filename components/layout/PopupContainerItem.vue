<template>
  <component
    :key="instance.id"
    :id="instance.id"
    :z-index="9900 + instanceIndex"
    :is="instanceComponent"
    v-bind="instance.propsData"
  />
</template>

<script setup>
const props = defineProps({
  /**
   * 팝업창 인스턴스
   */
  instance: {
    type: Object,
    required: true,
  },
  /**
   * 팝업창 인덱스
   */
  instanceIndex: {
    type: Number,
    required: true,
  },
});

/**
 * 팝업창 인스턴스 컴포넌트
 */
const instanceComponent = computed(() => {
  if (props.instance) {
    return import.meta.globEager('../**/*.vue')[`../${props.instance.componentName}.vue`].default;
  }
  return null;
});
</script>
