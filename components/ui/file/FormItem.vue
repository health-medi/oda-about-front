<template>
  <li :class="classes" @mouseenter="changeTargetFile(file)" @mouseleave="changeTargetFile(null)">
    <img
      v-if="isImage"
      :src="fileSrc"
      class="inline-block object-cover rounded-lg"
      :width="width"
      :height="height"
      :alt="file.displayName || file.file?.name"
      :style="{ maxWidth: `${width}px`, maxHeight: `${width}px`, minHeight: `${height}px` }"
    />
    <div v-else class="text-xs text-center">
      <UiIcon :icon="fileIcon" class="mr-1" />
      <span class="font-normal text-white">{{ file.displayNm }}</span>
    </div>

    <div class="group-hover:inline absolute top-0 right-1">
      <UiIcon
        v-if="disabled === false"
        icon="mdi-close"
        size="30"
        title="이 파일을 제거합니다."
        class="text-[#FF4E8B] hover:text-danger-800 cursor-pointer"
        @click="removeFile()"
      />
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  /**
   * 파일
   */
  file: {
    type: Object,
  },
  /**
   * 파일 항목 가로 크기 (px)
   */
  width: {
    type: [String, Number],
    default() {
      return 100;
    },
    required: false,
  },
  /**
   * 파일 항목 세로 크기 (px)
   */
  height: {
    type: [String, Number],
    default() {
      return 100;
    },
    required: false,
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
});

const emit = defineEmits(['change-target', 'remove-file']);

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = [
    'cursor-move',
    'text-center',
    'relative',
    'inline-block',
    'group',
    'h-full',
    'rounded-xl',
    'border-2',
    'border-gray-100',
    'hover:bg-gray-100',
  ];
  if (props.disabled) {
    classArray.push('disabled');
  }
  return classArray;
});

/**
 * 이미지 파일 이름 여부
 */
const isImageName = computed(() => {
  return /\.png|jpg|jpeg|gif$/.exec((props.file?.displayNm || props.file?.name).toLowerCase());
});

/**
 * 이미지 파일 여부
 */
const isImage = computed(() => {
  return isImageName.value && Boolean(props.file.thumb || props.file.attachId);
});

/**
 * 파일 이미지 src
 */
const fileSrc = computed(() => {
  if (isImage.value) {
    if (props.file.thumb) {
      return props.file.thumb;
    } else if (props.file.attachId) {
      return `/api/attach/view/${props.file.attachId}`;
    }
  } else {
    return null;
  }
});

/**
 * 파일 아이콘 값 가져오기
 */
const fileIcon = computed(() => {
  if (/\.xlsx$/.exec(props.file.name)) {
    // 엑셀
    return 'mdi-microsoft-excel';
  } else if (/\.docx$/.exec(props.file.name)) {
    // 워드
    return 'mdi-microsoft-word';
  } else if (/\.pptx$/.exec(props.file.name)) {
    // 파워포인트
    return 'mdi-microsoft-powerpoint';
  } else if (/\.pdf$/.exec(props.file.name)) {
    // PDF
    return 'mdi-file-pdf-box';
  } else if (/\.txt$/.exec(props.file.name)) {
    // Text
    return 'mdi-file-document';
  } else if (isImageName.value) {
    // Image
    return 'mdi-file-image';
  }
  return 'mdi-file';
});

/**
 * 대상 파일 변경
 */
const changeTargetFile = (file) => {
  emit('change-target', file);
};

/**
 * 파일 다운로드
 */
const downloadFile = () => {
  location.href = `/api/attach/download/${props.file.attachId}`;
};

/**
 * 파일 삭제
 */
const removeFile = () => {
  emit('remove-file', props.file);
};
</script>
