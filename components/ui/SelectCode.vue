<template>
  <div class="inline">
    <UiFormLabel :text="label" :required="required" v-if="label" />
    <div :class="wrapperClasses">
      <div class="flex z-10 justify-center items-center pl-1 w-10 text-center pointer-events-none" v-if="prefixIcon">
        <UiIcon :icon="prefixIcon" class="text-gray-300" />
      </div>
      <select
        v-model="localValue"
        :class="classes"
        :readonly="readonly"
        :disabled="disabled"
        @change="(event) => onChange(event.target.value)"
        v-if="codeList"
      >
        <option :value="null" class="text-gray-400" disabled v-if="placeholder">
          {{ placeholder }}
        </option>
        <option :value="codeItem.code" v-for="codeItem in codeList" :key="codeItem.code" class="text-gray-900">
          {{ codeItem.name }}
        </option>
      </select>
    </div>
    <p class="relative mb-3 h-3 whitespace-nowrap" v-if="name">
      <span
        class="overflow-hidden absolute top-0.5 left-1 w-full text-xs text-green-600 text-ellipsis"
        v-show="meta.valid && localValue"
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
</template>

<script setup>
import { useField } from 'vee-validate';

/**
 * 코드
 */
const { codeMap } = await useCode();

const props = defineProps({
  /**
   * 입력값
   */
  modelValue: {
    type: String,
  },
  /**
   * 이름 (유효성 확인 용도)
   */
  name: {
    type: String,
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
   * 타입
   */
  type: {
    type: String,
    required: true,
  },
  /**
   * 코드 목록
   */
  codeList: {
    type: Array,
  },
  /**
   * 크기
   */
  size: {
    type: String,
    default() {
      return 'md';
    },
    validator: function (value) {
      return ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(value) !== -1;
    },
  },
  /**
   * 가로 100%
   */
  block: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 앞쪽 삽입 아이콘
   */
  prefixIcon: {
    type: String,
  },
  /**
   * 성공 시 메세지
   */
  successMessage: {
    type: String,
    default: '',
  },
  /**
   * placeholder
   */
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const attrs = useAttrs();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      localValue.value = newVal;
      validateValue.value = newVal;
    }
  },
);

/**
 * 유효성 확인
 */
const {
  value: validateValue,
  errorMessage,
  meta,
} = props.name
  ? useField(props.name, undefined, {
      initialValue: props.modelValue,
    })
  : (() => ({
      value: ref(props.modelValue),
      errorMessage: ref(null),
      meta: {
        valid: true,
      },
    }))();

/**
 * 항목 목록
 */
const codeList = computed(() => {
  if (props.codeList?.length > 0) {
    return props.codeList;
  } else {
    return codeMap.value[props.type];
  }
});

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = [
    'bg-white',
    'shadow-inner',
    'border-2',
    'focus:border-[#FF4E8B]',
    'duration-200',
    'outline-none',
    'w-full',
    'rounded-xl',
    'hover:shadow-md',
    'focus:shadow-md',
    'focus:shadow-[#FF4E8B]/40',
    'placeholder:text-gray-400',
  ];
  switch (props.size) {
    case 'xs':
      classArray.push(...['text-xs', 'placeholder:text-xs', 'py-1', 'px-2']);
      break;
    case 'sm':
      classArray.push(...['text-sm', 'placeholder:text-sm', 'py-1', 'px-2']);
      break;
    case 'md':
      classArray.push(...['text-base', 'placeholder:text-base', 'py-2', 'px-3']);
      break;
    case 'lg':
      classArray.push(...['text-base', 'placeholder:text-base', 'py-2', 'px-4']);
      break;
    case 'xl':
      classArray.push(...['text-lg', 'placeholder:text-lg', 'py-4', 'px-4']);
      break;
  }
  classArray.push(...(!!errorMessage.value ? ['border-red-600', 'bg-red-50', 'focus:bg-white'] : ['border-gray-300']));
  if (props.prefixIcon) {
    classArray.push(...['pl-10', '-ml-10']);
  }
  if (attrs.class) {
    classArray.push(attrs.class);
  }
  if (!props.modelValue) {
    classArray.push('text-gray-400');
  }
  return classArray;
});

/**
 * 래퍼 클래스
 */
const wrapperClasses = computed(() => {
  const classArray = ['flex'];
  if (props.block) {
    classArray.push('w-full');
  }
  return classArray;
});

/**
 * 변경 시
 */
const onChange = (value) => {
  localValue.value = value;
  validateValue.value = value;
  emit('update:modelValue', value);
  emit('change', value);
};
</script>
