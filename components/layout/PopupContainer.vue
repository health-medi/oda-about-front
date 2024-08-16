<template>
  <LayoutPopupContainerItem
    v-for="(instance, instanceIndex) in instanceList"
    :key="instance.id"
    :instance="instance"
    :instance-index="instanceIndex"
  />
</template>

<script setup>
/**
 * 팝업창 인스턴스 맵
 */
const { instanceMap } = usePopup();

/**
 * 팝업창 인스턴스 목록
 */
const instanceList = computed(() => {
  const list = [];
  instanceMap.value.forEach((instance) => {
    list.push(instance);
  });
  return list;
});
</script>
