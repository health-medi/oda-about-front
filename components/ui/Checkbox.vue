<template>
  <div class="inline">
    <UiFormLabel :text="label" :required="required" v-if="label" />
    <div class="flex relative items-center">
      <label :for="id" class="mr-2 cursor-pointer select-none" v-if="leftSlot"><slot /></label>
      <input
        type="checkbox"
        v-model="localValue"
        :true-value="trueValue"
        :false-value="falseValue"
        :id="id"
        class="absolute w-5 h-5 opacity-0 cursor-pointer"
        :class="leftSlot ? 'right-0' : 'left-0'"
        :readonly="readonly"
        :disabled="disabled"
        @change="(event) => onChange(event.target.checked ? trueValue : falseValue)"
      />
      <div :class="classes" v-if="!icon">
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 21C16.299 21 21 16.299 21 10.5C21 4.70101 16.299 0 10.5 0C4.70101 0 0 4.70101 0 10.5C0 16.299 4.70101 21 10.5 21Z"
            :class="localValue === trueValue ? 'fill-[#FF4E8B]' : 'fill-gray-400'"
          />
          <path
            d="M7 10.7873L9.66 13.9998L14 8.1665"
            stroke="#F2F3F5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <label
        :for="id"
        :class="!leftSlot ? 'ml-1  mr-1 cursor-pointer select-none' : 'ml-1 cursor-pointer select-none'"
        v-if="!leftSlot"
        ><slot
      /></label>
    </div>
    <div v-if="!bottomSlot">
      <p class="relative mb-3 h-3 whitespace-nowrap" v-if="name">
        <span
          class="overflow-hidden absolute top-0.5 left-1 w-full text-xs text-green-600 text-ellipsis"
          v-show="meta.valid"
        >
          {{ successMessage }}
        </span>
        <span
          class="overflow-hidden absolute top-0.5 left-1 w-full text-xs font-bold text-red-600 text-ellipsis"
          v-show="errorMessage"
        >
          {{ errorMessage }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  /**
   * 입력값
   */
  modelValue: {
    type: [Object, Array, String, Boolean],
  },
  /**
   * 체크 시 입력값
   */
  trueValue: {
    type: [Object, Boolean, String],
    default() {
      return true;
    },
  },
  /**
   * 체크 해제 시 입력값
   */
  falseValue: {
    type: [Object, Boolean, String],
    default() {
      return false;
    },
  },
  /**
   * 이름 (유효성 확인 용도)
   */
  name: {
    type: String,
  },
  /**
   * 아이디
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * 레이블
   */
  label: {
    type: String,
  },
  /**
   * 왼쪽 슬롯 여부
   */
  leftSlot: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 아래쪽 슬롯 여부
   */
  bottomSlot: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 아이콘 여부
   */
  icon: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * (레이블 표시용) 필수 여부
   */
  required: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * disabled
   */
  disabled: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * readonly
   */
  readonly: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 성공 시 메세지
   */
  successMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const attrs = useAttrs();

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      localValue.value = newVal;
    }
  },
);

/**
 * 유효성 확인
 */
const {
  value: localValue,
  errorMessage,
  handleChange,
  meta,
} = useField(props.name || 'input', undefined, {
  initialValue: props.modelValue,
});

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = ['flex', 'justify-center', 'items-center', 'mr-1', 'w-5', 'w-5', 'cursor-pointer'];
  classArray.push(...(!!errorMessage.value ? ['border-red-600', 'bg-red-50', 'focus:bg-white'] : ['border-gray-300']));
  if (attrs.class) {
    classArray.push(attrs.class);
  }
  return classArray;
});

/**
 * 변경 시
 */
const onChange = (value) => {
  localValue.value = value;
  handleChange(localValue.value);
  emit('update:modelValue', localValue.value);
  emit('change', localValue.value);
};
</script>

<style lang="scss" scoped>
input:checked + div {
  @apply border-blue-500;
}
input:checked + div svg {
  @apply block;
}
</style>
