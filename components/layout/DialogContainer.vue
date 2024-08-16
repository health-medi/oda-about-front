<template>
  <component
    :key="instance.id"
    :id="instance.id"
    :z-index="9000 + instanceIndex"
    :is="instanceComponent"
    :instanceIndex="instanceIndex"
    v-bind="instance.propsData"
    v-if="instance"
  />
</template>

<script setup>
const props = defineProps({
  /**
   * 인스턴스 인덱스
   */
  instanceIndex: {
    type: Number,
  },
});

/**
 * 대화창 인스턴스 목록
 */
const { instanceList } = useDialog();

/**
 * 대화창 인스턴스
 */
const instance = computed(() =>
  instanceList.value.length > props.instanceIndex ? instanceList.value[props.instanceIndex] : null,
);

/**
 * 대화창 인스턴스 컴포넌트
 */
const instanceComponent = computed(() => {
  if (instance) {
    return import.meta.globEager('../**/*.vue')[`../${instance.value.componentName}.vue`].default;
  }
  return null;
});
</script>
