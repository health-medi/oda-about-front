<template>
  <div>
    <ClientOnly>
      <div v-if="isInit">
        <NuxtLayout>
          <NuxtPage :key="$route.fullPath" />
        </NuxtLayout>
      </div>
      <UiOverlay v-else>
        <UiIcon icon="loading" size="100" class="stroke-gray-500" />
        <h1 class="text-gray-500">화면을 준비 중입니다...</h1>
      </UiOverlay>
    </ClientOnly>
  </div>
</template>

<script setup>
/**
 * 어플리케이션 구동 여부
 */
const { isInit } = useApplication();

onMounted(() => {
  isInit.value = true;
  screenHeight.value = window.innerHeight;
  screenWidth.value = window.innerWidth;
});
const { screenHeight, screenWidth, onscroll } = useScroll();
</script>
