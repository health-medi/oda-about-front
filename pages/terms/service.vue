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
<script setup></script>
