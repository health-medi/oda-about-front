<template>
  <div
    class="inline-block overflow-hidden p-0 m-0 my-4 text-sm align-top whitespace-nowrap"
    v-if="param && pagination && props.param.total > 0"
  >
    <template v-if="!pagination.isFirstPageGroup">
      <span
        class="first:pl-2 w-4 align-top bg-white hover:bg-gray-100 cursor-pointer"
        @click="onFetch(pagination.firstPage)"
      >
        <UiIcon icon="mdi-chevron-double-left" />
      </span>
      <span class="w-4 align-top bg-white hover:bg-gray-100 cursor-pointer" @click="onFetch(pagination.prevPage)">
        <UiIcon icon="chevronLeft" />
      </span>
    </template>
    <span
      class="px-1 mx-4 last:mr-6 first:ml-6 h-8 disabled:text-gray-300 bg-white hover:bg-gray-100 cursor-pointer"
      :class="{
        'font-extrabold': pagination.page === pageItem,
      }"
      v-for="pageItem in pagination.pageItems"
      :key="pageItem"
      @click="onFetch(pageItem)"
    >
      {{ pageItem }}
    </span>
    <template v-if="!pagination.isLastPageGroup">
      <span class="w-4 align-top bg-white hover:bg-gray-100 cursor-pointer" @click="onFetch(pagination.nextPage)">
        <UiIcon icon="chevronRight" />
      </span>
      <span
        class="last:pr-2 w-4 align-top bg-white hover:bg-gray-100 cursor-pointer"
        @click="onFetch(pagination.lastPage)"
      >
        <UiIcon icon="mdi-chevron-double-right" />
      </span>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  param: {
    type: Object,
  },
});

const emit = defineEmits(['fetch']);

/**
 * 페이지네이션 객체
 */
const pagination = computed(() => {
  const page = props.param.page;
  const size = props.param.size;
  const total = props.param.total;

  if (total < 1) {
    return null;
  }

  const firstPage = 1;
  const lastPage = Math.ceil(total / size);

  const pageItems = [];
  const pageGroupSize = 5;
  const pageGroupNo = Math.ceil(page / pageGroupSize);
  const lastPageGroupNo = Math.ceil(lastPage / pageGroupSize);
  const firstPageItem = pageGroupNo * pageGroupSize - pageGroupSize + 1;
  let lastPageItem = firstPageItem + pageGroupSize - 1;
  if (lastPageItem > lastPage) lastPageItem = lastPage;
  for (let i = firstPageItem; i <= lastPageItem; i++) {
    pageItems.push(i);
  }
  const prevPage = pageItems[0] - 1;
  let nextPage = pageItems[pageItems.length - 1] + 1;
  if (nextPage > lastPage) nextPage = lastPage;

  return {
    page,
    size,
    total,
    pageItems,
    pageGroupSize,
    firstPage,
    lastPage,
    prevPage,
    nextPage,
    isFirstPageGroup: pageGroupNo === 1,
    isLastPageGroup: pageGroupNo === lastPageGroupNo,
  };
});

/**
 * 페이지 이동
 */
const onFetch = (page) => {
  emit('fetch', Object.assign({}, props.param, { page }));
};
</script>
