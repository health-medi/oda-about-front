<template>
  <div>
    <!-- 광고주 서비스약관  -->
    <LayoutContents
      class="flex overflow-x-hidden overflow-y-auto relative flex-col flex-1 scrollbar-thin scrollbar-thumb-gray-500"
      noHeaderLine
    >
      <TermsMenu />
      <div class="mt-20">
        <UiPageTitle text="서비스 이용약관" />
      </div>
      <TermsServiceContents />
    </LayoutContents>
  </div>
</template>

<script setup>
// 이 페이지에서는 레이아웃을 사용하지 않도록 설정
definePageMeta({
  layout: false,
});
</script>
