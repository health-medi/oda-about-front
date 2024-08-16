<template>
  <div class="inline">
    <UiFormLabel :text="label" :required="required" v-if="label" />
    <div class="flex gap-5 items-center mt-0.5">
      <div class="flex relative items-center" v-for="item in items" :key="item[itemKey]">
        <input
          type="radio"
          v-model="localValue"
          :value="item[itemKey]"
          :id="`${id}-${item[itemKey]}`"
          :name="id"
          class="absolute left-0 w-6 h-6 opacity-0 cursor-pointer"
          :readonly="readonly"
          :disabled="disabled"
          @change="onChange(item)"
        />
        <div :class="classes">
          <svg
            class="hidden w-3 h-3 text-[#FF4E8B] pointer-events-none fill-current"
            version="1.1"
            viewBox="0 0 17 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(-9 -11)" fill="#FF4E8B" fill-rule="nonzero">
                <path
                  d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"
                />
              </g>
            </g>
          </svg>
        </div>
        <label :for="`${id}-${item[itemKey]}`" class="ml-1 cursor-pointer select-none">{{ item[itemText] }}</label>
      </div>
    </div>
    <p class="relative mb-3 h-3 whitespace-nowrap" v-if="name">
      <span
        class="overflow-hidden absolute top-0.5 left-1 w-full text-xs text-green-600 text-ellipsis"
        v-show="meta.valid"
      >
        {{ successMessage }}
      </span>
      <span
        class="overflow-hidden absolute top-0.5 left-1 w-full text-xs text-red-600 text-ellipsis"
        v-show="errorMessage"
      >
        {{ errorMessage }}
      </span>
    </p>
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
   * 항목 목록
   */
  items: {
    type: Array,
    required: true,
  },
  /**
   * 항목 키
   */
  itemKey: {
    type: String,
    default() {
      return 'value';
    },
  },
  /**
   * 항목 텍스트
   */
  itemText: {
    type: String,
    default() {
      return 'text';
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
} = props.name
  ? useField(props.name, undefined, {
      initialValue: props.modelValue,
    })
  : (() => ({
      value: ref(props.modelValue),
      errorMessage: ref(null),
      handleChange: () => {},
      meta: {
        valid: true,
      },
    }))();

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = [
    'flex',
    'justify-center',
    'items-center',
    'mr-1',
    'w-4',
    'h-4',
    'bg-white',
    'rounded-full',
    'border',
    'focus-within:border-[#FF4E8B]',
    'cursor-pointer',
  ];
  classArray.push(...(!!errorMessage.value ? ['border-red-600', 'bg-red-50', 'focus:bg-white'] : ['border-gray-300']));
  if (attrs.class) {
    classArray.push(attrs.class);
  }
  return classArray;
});

/**
 * 변경 시
 * @param item
 */
const onChange = (item) => {
  localValue.value = item[props.itemKey];
  handleChange(localValue.value);
  emit('update:modelValue', localValue.value);
  emit('change', localValue.value);
};
</script>

<style lang="scss" scoped>
input:checked + div {
  @apply border-[#FF4E8B];
}
input:checked + div svg {
  @apply block;
}
</style>
