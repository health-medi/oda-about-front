<template>
  <div
    id="app-bar"
    class="bottom-0 py-3 px-5 w-full h-[130px] text-center bg-white duration-500 md:hidden"
    :style="yOffset < breakPoint && yOffset > 112 ? 'position : sticky' : 'position : relative'"
  >
    <p class="mb-2 text-primary-500">앱을 확인해보세요!</p>
    <UiButton text="앱 다운로드" variant="primary" class="w-full h-14 text-lg" @click="checkMobile()" />
  </div>
</template>
<script setup>
const { yOffset, breakPoint, screenHeight } = useScroll();
const { checkMobile } = useCheckOs();
</script>
