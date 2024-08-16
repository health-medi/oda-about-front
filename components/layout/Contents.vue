<template>
  <div>
    <div class="text-xl font-bold" :class="!noHeaderLine ? 'py-4 border-b-2 border-b-gray-300' : 'pt-4'">
      <LayoutHeader :class="!noHeaderLine ? 'pb-7' : 'pb-4'" v-if="header" />
      <div class="flex justify-between px-4 mx-auto max-w-[1024px]">
        <div class="flex items-center">
          <UiIcon
            icon="linkLeft"
            size="20"
            class="mt-1 mr-2 cursor-pointer"
            @click.prevent="$router.go(-1)"
            v-if="back"
          />
          <slot name="title" />
        </div>
        <slot name="button" />
        <NuxtLink to="/" class="mt-1" v-if="home">
          <UiIcon icon="home" size="20" />
        </NuxtLink>
      </div>
    </div>
    <div class="flex-1 w-full" :class="{ 'p-4': !noPadding, 'mx-auto max-w-[1024px]': !noLimit }">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * 헤더 표시 여부
   */
  header: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 뒤로가기 버튼 표시 여부
   */
  back: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 홈 버튼 표시 여부
   */
  home: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 여백없음
   */
  noPadding: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 헤더 아래 라인 없음
   */
  noHeaderLine: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 가로크기 제한 없음
   */
  noLimit: {
    type: Boolean,
    default() {
      return false;
    },
  },
});
</script>
