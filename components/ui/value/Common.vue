<template>
  <template v-if="value !== null && value !== undefined && value !== ''">
    <NuxtLink
      :to="link"
      class="hover:text-blue-500 underline underline-offset-1"
      v-if="link"
      ><UiValueCommon :value="value" :limit="limit"
    /></NuxtLink>
    <UiValueDate :value="value" v-else-if="format === 'date'" />
    <UiValueCurrency :value="value" v-else-if="format === 'currency'" />
    <span
      v-else-if="format === 'phone'"
      class="text-md whitespace-pre-wrap"
      :class="classList"
    >
      {{ phoneString(value, isMasking) }}
    </span>
    <span class="whitespace-nowrap" v-else>{{ value }}</span>
  </template>
  <span class="text-xs text-gray-400 whitespace-nowrap" v-else>{{
    emptyText
  }}</span>
</template>

<script setup>
import {
  limit as limitString,
  phone as phoneString,
} from "@/plugins/utils/string.utils";
const props = defineProps({
  /**
   * 값
   */
  value: {
    type: [Object, String, Number],
  },
  /**
   * 출력 포맷
   */
  format: {
    type: String,
    default: "text",
    validator: function (value) {
      return ["text", "date", "currency", "phone"].indexOf(value) !== -1;
    },
  },
  /**
   * 링크
   */
  link: {
    type: String,
  },
  /**
   * 비어있는 링크
   */
  emptyLink: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 비어있을때 기본 출력 값
   */
  emptyText: {
    type: String,
    default() {
      return "(없음)";
    },
  },
  /**
   * (전화번호) 마스킹 여부
   */
  masking: {
    type: Boolean,
    default() {
      return false;
    },
  },
});

const isMasking = computed(() => {
  props.masking === true;
});
</script>
