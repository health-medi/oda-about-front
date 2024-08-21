<template>
  <div class="grid grid-cols-3 gap-2 w-[600px]">
    <h3 class="h-12 leading-[48px]">오다 한의원</h3>
    <NuxtLink
      active-class="terms-menu-style"
      to="/terms/privacy"
      class="p-3.5 w-44 h-12 text-sm text-center rounded border"
    >
      개인정보 처리방침
    </NuxtLink>
    <NuxtLink
      active-class="terms-menu-style"
      to="/terms/service"
      class="p-3.5 w-44 h-12 text-sm text-center rounded border"
    >
      서비스 이용약관
    </NuxtLink>
  </div>
</template>
<script setup></script>
