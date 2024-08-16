<template>
  <section>
    <div class="static">
      <div class="absolute inset-x-0 bottom-20 pb-[12px] text-center text-black sm:text-[24px] md:block md:bottom-32">
        <div class="pb-5 md:hidden">
          <UiButton text="앱 다운로드" variant="primary" size="xl" @click="checkMobile()" />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const { checkMobile } = useCheckOs();
</script>
