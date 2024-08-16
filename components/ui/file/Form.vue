<template>
  <div class="inline">
    <UiFormLabel v-if="label" :text="label" :required="required" />
    <div class="flex gap-2">
      <div
        v-show="!isFull"
        class="shrink-0 rounded-xl border-dashed"
        :class="classes"
        :style="{ width: `${width}px`, height: `${height}px` }"
      >
        <VueFileUpload
          ref="upload"
          v-model="uploadFiles"
          :post-action="`/api/attach/upload/${subType}`"
          :extensions="extensions"
          :accept="accept"
          :headers="{}"
          :data="{}"
          :drop="true"
          :multiple="multiple"
          :maximum="limit"
          :input-id="inputId"
          class="w-full h-full rounded-xl"
          title="여기를 클릭하여 파일을 업로드합니다."
          @input-file="onInputFile"
          @input-filter="onInputFilter"
          @mouseenter="targetFile = null"
        >
          <div class="flex justify-center items-center w-full h-full text-gray-500 bg-white">
            <div class="text-gray-300">
              <UiIcon icon="mdi-plus" size="36" class="block" />
              <div v-if="limit > 1" class="pb-3">최대 {{ limit }}개</div>
            </div>
          </div>
        </VueFileUpload>
      </div>
      <viewer v-if="uploadFiles.length > 0" :images="uploadFiles">
        <Draggable
          v-model="uploadFiles"
          tag="ul"
          item-key="id"
          :class="`flex pl-1 gap-2 flex-nowrap h-[${height}px]`"
          @end="onChangeFiles"
        >
          <template #item="{ element }">
            <UiFileFormItem
              :file="element"
              :width="width"
              :height="height"
              :disabled="disabled"
              :hide-download="hideDownload"
              :classes="classes"
              @change-target="(file) => (targetFile = file)"
              @remove-file="removeFile(element)"
            />
          </template>
        </Draggable>
      </viewer>
    </div>

    <p v-if="name" class="relative mb-3 h-2 whitespace-nowrap">
      <span
        v-show="errorMessage"
        class="overflow-hidden absolute top-0.5 left-1 w-full text-xs font-bold text-red-600 text-ellipsis"
      >
        {{ errorMessage }}
      </span>
    </p>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { useField } from 'vee-validate';
import { fileSize } from '~~/plugins/utils/number.utils';

const props = defineProps({
  /**
   * 첨부파일 모음 객체
   */
  modelValue: {
    type: Object,
    default() {
      return {};
    },
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
   * 첨부파일 유형
   */
  type: {
    type: String,
    required: true,
  },
  /**
   * 첨부파일 보조 유형
   */
  subType: {
    type: String,
    required: true,
  },
  /**
   * 최대 업로드 개수 (기본값: 1)
   */
  limit: {
    type: Number,
    default() {
      return 1;
    },
  },
  /**
   * (이미지 파일만 해당) 압축대상 용량 기준
   * 입력된 byte수를 초과하는 파일은 자동 압축
   */
  autoCompress: {
    type: Number,
    default() {
      return 1048576; // 1024.00 KB 이상 이미지 파일 압축
    },
  },
  /**
   * 허용되는 확장자
   */
  extensions: {
    type: String,
    default() {
      return 'gif,jpg,jpeg,png';
    },
  },
  /**
   * 허용되는 MIME Type
   */
  accept: {
    type: String,
    default() {
      return 'image/png,image/gif,image/jpeg';
    },
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
   * 복사 여부
   */
  copy: {
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
   * 파일 다운로드 버튼 숨기기
   */
  hideDownload: {
    type: Boolean,
    default() {
      return false;
    },
  },

  /**
   * 다중 선택
   */
  multiple:{
    type: Boolean,
    default() {
      return true;
    },
  }
});

const emit = defineEmits(['update:modelValue']);

/**
 * 업로드 컴포넌트
 */
const upload = ref(null);

/**
 * 업로드 파일 객체 목록
 */
const uploadFiles = ref([]);

/**
 * 현재 마우스 오버한 파일
 */
const targetFile = ref(null);

/**
 * 유효성 확인
 */
const {
  value: localValue,
  errorMessage,
  handleChange,
} = useField(`${props.name}.${props.subType}` || 'file-input', undefined, {
  initialValue: _.cloneDeep(props.modelValue[props.subType]),
});

/**
 * 업로드 제한 가득 참
 */
const isFull = computed(() => props.limit !== 0 && props.limit <= uploadFiles.value.length);

/**
 * input id
 */
const inputId = computed(() => `file-${props.name}-${props.name}-${props.subType}`);

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = ['border', 'duration-200', 'outline-none', 'hover:shadow-md', 'focus:shadow-md'];
  classArray.push(...(!!errorMessage.value ? ['border-red-600', 'focus:bg-white'] : ['border-gray-300']));
  return classArray;
});

/**
 * 두 배열이 동일한지 비교
 */
const isEqual = (newList = [], oldList = []) => {
  if (newList.length !== oldList.length) {
    return false;
  }
  let isNotEqual = false;
  newList.some((newItem, newIndex) => {
    if (newItem.id !== oldList[newIndex].id) {
      isNotEqual = true;
    }
    return isNotEqual;
  });
  return !isNotEqual;
};

/**
 * modelValue 감시
 */
watch(
  () => props.modelValue,
  (newVal) => {
    // 파일 목록
    const inputAttachBag = newVal || {};
    const inputUploadFiles = inputAttachBag[props.subType] || [];
    const localUploadFiles = uploadFiles.value || [];
    if (!isEqual(inputUploadFiles, localUploadFiles)) {
      uploadFiles.value = inputUploadFiles || [];
      uploadFiles.value.forEach((uploadFile) => {
        uploadFile.id = uploadFile.attachId;
        uploadFile.name = uploadFile.displayName;
        uploadFile.size = uploadFile.fileSize;
      });
    }
  },
  {
    immediate: true,
  },
);

/**
 * 파일 변경 filter
 * @param newFile
 * @param oldFile
 * @param prevent
 */
const onInputFilter = (newFile, oldFile, prevent) => {
  if (newFile && newFile.file && !oldFile) {
    // Before adding a file
    // Filter system files or hide files
    if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
      return prevent();
    }
    // Filter php html js file
    if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
      return prevent();
    }
    // Automatic compression
    /* if (
      newFile.file &&
      newFile.type.substr(0, 6) === 'image/' &&
      props.autoCompress > 0 &&
      props.autoCompress < newFile.size
    ) {
      newFile.error = 'compress';
      const imageCompressor = new ImageCompressor();
      imageCompressor
        .compress(newFile.file, {
          convertSize: 1000000,
          maxWidth: 1920,
        })
        .then((file) => {
          upload.value.update(newFile, {
            error: '',
            file,
            size: file.size,
            type: file.type,
          });
        })
        .catch((err) => {
          upload.value.update(newFile, { error: err.message || 'compress' });
        });
    } */
  }
  if (newFile && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
    // Create a blob field
    newFile.blob = '';
    const URL = window.URL || window.webkitURL;
    if (URL && URL.createObjectURL) {
      newFile.blob = URL.createObjectURL(newFile.file);
    }
    // Thumbnails
    newFile.thumb = '';
    if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
      newFile.thumb = newFile.blob;
    }
  }
  return false;
};

/**
 * 파일 변경 이벤트 처리
 * @param newFile
 * @param oldFile
 */
const onInputFile = (newFile, oldFile) => {
  // Update file
  if (newFile && oldFile) {
    // Upload progress
    if (newFile.progress !== oldFile.progress) {
      console.log('progress', newFile.progress, newFile);
    }

    // Upload error
    if (newFile.error !== oldFile.error && oldFile.error !== 'compress') {
      /* $toast.error({
        title: '파일 업로드 실패',
        text: `${newFile.name} 업로드에 실패하였습니다. ${newFile.error}`,
      }); */
      upload.value.remove(newFile);
    }

    // Uploaded successfully
    if (newFile.success !== oldFile.success) {
      /* $toast.success({
        title: '파일 업로드 성공',
        text: `${newFile.name} 업로드가 완료되었습니다.`,
      }); */
      newFile.attachType = props.type;
      newFile.attachSubType = props.subType;
      newFile.attachId = newFile.response;
      onChangeFiles();
    }
  }
  // Automatic upload
  if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
    if (newFile && !newFile.active) {
      newFile.active = true;
    }
  }
  if (!newFile && oldFile) {
    // remove
    onChangeFiles(oldFile);
  }
};

/**
 * 파일 삭제
 */
const removeFile = (file) => {
  targetFile.value = null;
  upload.value.remove(file);
};

/**
 * 파일 목록 변경 이벤트 처리
 */
const onChangeFiles = (deleteFile) => {
  const inputUploadFiles = _.cloneDeep(uploadFiles.value) || [];
  for (let i = 0; i < inputUploadFiles.length; i++) {
    if (inputUploadFiles[i].el) {
      delete inputUploadFiles[i].el;
    }
  }
  const attachBag = _.cloneDeep(props.modelValue || {});
  let isChanged = false;
  if (!isEqual(inputUploadFiles, attachBag[props.subType])) {
    attachBag[props.subType] = inputUploadFiles;
    isChanged = true;
  }
  if (deleteFile && deleteFile.id) {
    isChanged = true;
  }
  if (isChanged) {
    localValue.value = attachBag[props.subType];
    handleChange(attachBag);
    emit('update:modelValue', attachBag);
  }
};
</script>
