<template>
  <div class="inline">
    <UiFormLabel :text="label" :required="required" v-if="label" />
    <div :class="wrapperClasses">
      <input
        :type="type"
        v-model="localValue"
        :class="classes"
        :id="id"
        :minlength="minlength"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="(event) => onChange(event.target.value)"
        v-if="isText"
      />
      <CleaveInput
        v-model="localValue"
        :class="classes"
        :id="id"
        :options="cleaveOptions"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        @changeValue="onChange"
        v-else-if="
          isPhone ||
          isMobile ||
          isCompanyNumber ||
          isNumber ||
          isPhysical ||
          isCurrency ||
          isDate ||
          isTime
        "
      />
      <TextareaAutosize
        v-model="localValue"
        :class="classes"
        :minlength="minlength"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="(event) => onChange(event.target.value)"
        v-else-if="isTextarea"
      />
    </div>
    <p class="relative mb-2 h-3 whitespace-nowrap" v-if="name">
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
import { useField } from "vee-validate";

const props = defineProps({
  /**
   * 입력값
   */
  modelValue: {
    type: [Number, String],
  },
  /**
   * 이름 (유효성 확인 용도)
   */
  name: {
    type: String,
  },
  /**
   * id (식별용)
   */
  id: {
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
   * minlength
   */
  minlength: {
    type: [String, Number],
  },
  /**
   * maxlength
   */
  maxlength: {
    type: [String, Number],
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
    default() {
      return "text";
    },
    validator: function (value) {
      return (
        [
          "text",
          "email",
          "password",
          "textarea",
          "phone",
          "mobile",
          "company-number",
          "number",
          "physical",
          "currency",
          "date",
          "time",
        ].indexOf(value) !== -1
      );
    },
  },
  /**
   * 크기
   */
  size: {
    type: String,
    default() {
      return "md";
    },
    validator: function (value) {
      return ["xs", "sm", "md", "lg", "xl"].indexOf(value) !== -1;
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
   * 성공 시 메세지
   */
  successMessage: {
    type: String,
    default: "",
  },
  /**
   * placeholder
   */
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const attrs = useAttrs();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      localValue.value = newVal;
      validateValue.value = newVal;
    }
  }
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
 * 입력 구분이 텍스트 영역인지 여부
 */
const isTextarea = computed(() => {
  return ["textarea"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 전화인지 여부
 */
const isPhone = computed(() => {
  return ["phone"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 휴대폰인지 여부
 */
const isMobile = computed(() => {
  return ["mobile"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 사업자등록번호인지 여부
 */
const isCompanyNumber = computed(() => {
  return ["company-number"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 숫자인지 여부
 */
const isNumber = computed(() => {
  return ["number"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 신체정보인지 여부
 */
const isPhysical = computed(() => {
  return ["physical"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 금액인지 여부
 */
const isCurrency = computed(() => {
  return ["currency"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 날짜(YYYY-MM-DD)인지 여부
 */
const isDate = computed(() => {
  return ["date"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 시간(00:00)인지 여부
 */
const isTime = computed(() => {
  return ["time"].indexOf(props.type) !== -1;
});

/**
 * 입력 구분이 일반 텍스트인지 여부
 */
const isText = computed(() => {
  return ["text", "email", "password"].indexOf(props.type) !== -1;
});

/**
 * cleave.js options
 */
const cleaveOptions = computed(() => {
  if (isPhone.value || isMobile.value) {
    return {
      phone: true,
      phoneRegionCode: "KR",
      delimiter: "-",
    };
  } else if (isCompanyNumber.value) {
    return {
      blocks: [3, 2, 5],
      numericOnly: true,
      delimiter: "-",
    };
  } else if (isPhysical.value) {
    return {
      blocks: [3],
      numericOnly: true,
    };
  } else if (isNumber.value) {
    return {
      numeral: true,
      numericOnly: true,
    };
  } else if (isCurrency.value) {
    return {
      numeral: true,
      numericOnly: true,
      numeralThousandsGroupStyle: "thousand",
    };
  } else if (isDate.value) {
    return {
      date: true,
      delimiter: "-",
      datePattern: ["Y", "m", "d"],
    };
  } else if (isTime.value) {
    return {
      time: true,
      timePattern: ["h", "m"],
    };
  }
  return null;
});

/**
 * 클래스
 */
const classes = computed(() => {
  const classArray = [
    "bg-white",
    "shadow-inner",
    "border-2",
    "focus:border-[#FF4E8B]",
    "duration-200",
    "outline-none",
    "w-full",
    "rounded-xl",
    "hover:shadow-md",
    "focus:shadow-md",
    "focus:shadow-[#FF4E8B]/40",
    "placeholder:text-gray-400",
  ];
  switch (props.size) {
    case "xs":
      classArray.push(...["text-xs", "placeholder:text-sm", "py-1", "px-2"]);
      break;
    case "sm":
      classArray.push(...["text-sm", "placeholder:text-sm", "py-1", "px-2"]);
      break;
    case "md":
      classArray.push(
        ...["text-base", "placeholder:text-base", "py-2", "px-3"]
      );
      break;
    case "lg":
      classArray.push(
        ...["text-base", "placeholder:text-base", "py-2", "px-4"]
      );
      break;
    case "xl":
      classArray.push(...["text-lg", "placeholder:text-lg", "py-4", "px-4"]);
      break;
  }
  classArray.push(
    ...(!!errorMessage.value
      ? ["border-red-600", "bg-red-50", "focus:bg-white"]
      : ["border-gray-300"])
  );
  if (attrs.class) {
    classArray.push(attrs.class);
  }
  return classArray;
});

/**
 * 래퍼 클래스
 */
const wrapperClasses = computed(() => {
  const classArray = ["flex"];
  if (props.block) {
    classArray.push("w-full");
  }
  return classArray;
});

/**
 * 변경 시
 */
const onChange = (value) => {
  localValue.value = value;
  validateValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
};
</script>
