<template>
  <button :type="type" :class="classes" :disabled="isDisabled" @click="onClick">
    <span
      class="absolute w-0 h-0 bg-gradient-to-tl from-white to-transparent rounded-sm border-gray-500 opacity-30 transition-all duration-200 ease-out"
      :class="{ 'group-focus:w-full group-focus:h-full group-hover:w-full group-hover:h-full': !isDisabled }"
    ></span>
    <span class="group flex relative flex-row gap-1">
      <span
        class="select-none"
        :class="{
          'hidden group-hover:inline': autoHide,
        }"
        v-if="!!slots.text || text"
      >
        <slot name="text" v-if="!!slots.text"></slot>
        <template v-else>{{ text }}</template>
      </span>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  /**
   * 버튼 타입
   */
  type: {
    type: String,
    default() {
      return 'button';
    },
    validator: function (value) {
      return ['button', 'submit'].indexOf(value) !== -1;
    },
  },
  /**
   * 버튼 텍스트
   */
  text: {
    type: String,
  },
  /**
   * 버튼 색상 종류
   */
  variant: {
    type: String,
    default() {
      return 'default';
    },
    validator: function (value) {
      return ['default', 'primary', 'info', 'success', 'warning', 'danger', 'pink'].indexOf(value) !== -1;
    },
  },
  /**
   * 버튼 크기
   */
  size: {
    type: String,
    default() {
      return 'xs';
    },
    validator: function (value) {
      return ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'].indexOf(value) !== -1;
    },
  },
  /**
   * 가로 크기 100%
   */
  block: {
    type: Boolean,
    default() {
      return false;
    },
  },
  /**
   * 텍스트 자동 숨김
   */
  autoHide: {
    type: Boolean,
    default() {
      return false;
    },
  },
});

const slots = useSlots();

/**
 * 로딩
 */
const { isLoading } = useLoading();

/**
 * 비활성화 여부 (중복클릭 방지)
 */
const localDisabled = ref(false);

/**
 * 비활성화 여부
 */
const isDisabled = computed(() => isLoading.value || useAttrs().disabled || localDisabled.value);

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = [
    'relative',
    'inline-flex',
    'group',
    'items-center',
    'justify-center',
    'shadow',
    'whitespace-nowrap',
    'disabled:opacity-50',
    'duration-200',
    'rounded-xl',
    'outline-none',
  ];
  switch (props.variant) {
    case 'primary':
    case 'info':
    case 'success':
    case 'warning':
    case 'danger':
      classArray.push(...[`bg-${props.variant}-500`, 'text-white', 'font-bold']);
    case 'pink':
      classArray.push(...[`bg-[#FF4E8B]`, 'text-white', 'font-bold']);
      break;
    case 'default':
      classArray.push(
        ...['bg-white', 'hover:bg-black', 'focus:bg-black', 'hover:text-white', 'focus:text-white', 'border'],
      );
      break;
  }
  switch (props.size) {
    case '2xs':
      classArray.push(...['text-xs', 'py-0.5', 'px-4']);
      break;
    case 'xs':
      classArray.push(...['text-xs', 'py-1', 'px-5']);
      break;
    case 'sm':
      classArray.push(...['text-sm', 'py-1.5', 'px-6', 'h-8']);
      break;
    case 'md':
      classArray.push(...['text-base', 'py-1.5', 'px-6']);
      break;
    case 'lg':
      classArray.push(...['text-lg', 'py-1.5', 'px-6']);
      break;
    case 'xl':
      classArray.push(...['text-xl', 'py-3', 'px-8']);
      break;
  }
  if (props.block) {
    classArray.push('w-full');
  }
  if (!isDisabled.value) {
    classArray.push('hover:shadow-md');
  }
  if (isLoading.value) {
    classArray.push('cursor-progress');
  }
  const attrClasses = useAttrs().class;
  if (attrClasses) {
    classArray.push(attrClasses);
  }
  return classArray;
});

/**
 * 버튼 클릭 시
 */
const onClick = () => {
  // 버튼 비활성화
  localDisabled.value = true;
  setTimeout(() => {
    // 1초 뒤 해제
    localDisabled.value = false;
  }, 1000);
};
</script>
