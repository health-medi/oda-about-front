<template>
  <div class="grid grid-cols-2">
    <div>
      <slot name="left"></slot>
    </div>
    <div class="flex flex-row-reverse gap-2">
      <slot name="right"></slot>
    </div>
  </div>
</template>
