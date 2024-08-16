<template>
  <TransitionRoot appear :show="isVisible" as="div">
    <!-- Popup Wrapper -->
    <Dialog
      as="div"
      :id="`popup-wrapper-${id}`"
      class="flex fixed inset-0 top-0 left-0 z-50 justify-center items-center p-5 w-screen min-h-screen bg-center bg-no-repeat bg-cover outline-none focus:outline-none"
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
      :style="{ zIndex }"
    >
      <TransitionChild
        as="div"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <!-- Popup -->
        <div :id="`popup-${id}`" class="relative p-5 m-auto w-full min-w-[280px] bg-gray-600 rounded-xl shadow-xl">
          <!-- Popup Header -->
          <div class="flex flex-nowrap" v-if="!!slots.title">
            <div class="flex-auto">
              <h2 class="mr-10 text-xl font-bold text-white">
                <slot name="title" :close="close" :dismiss="dismiss" :is-visible="isVisible"></slot>
              </h2>
            </div>
            <div class="flex-auto text-right">
              <slot
                name="headerButton"
                :id="id"
                :close="close"
                :dismiss="dismiss"
                :is-visible="isVisible"
                v-if="!!slots.headerButton"
              ></slot>
              <button type="button" title="닫기" aria-label="닫기" @click="dismiss" v-else>
                <UiIcon icon="cancel" size="20" class="fill-white" />
              </button>
            </div>
          </div>
          <!-- Popup Body -->
          <div class="mb-2" style="max-height: calc(100vh - 220px)">
            <slot :id="id" :close="close" :dismiss="dismiss" :is-visible="isVisible"></slot>
          </div>
          <!-- Popup Footer -->
          <div class="text-white">
            <slot
              name="footer"
              :id="id"
              :close="close"
              :close-with-day="closeWithDay"
              :dismiss="dismiss"
              :is-visible="isVisible"
              v-if="!!slots.footer"
            ></slot>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { TransitionRoot, TransitionChild, Dialog } from '@headlessui/vue';

const slots = useSlots();

const emit = defineEmits(['init']);

/**
 * 팝업창 아이디
 */
const id = computed(() => getCurrentInstance().parent.attrs.id);

/**
 * 팝업창 인스턴스
 */
const instance = computed(() => usePopup().getInstance(id.value));

/**
 * 팝업창 z-index
 */
const zIndex = computed(() => getCurrentInstance().parent.attrs.zIndex);

/**
 * 인덱스
 */
const instanceIndex = computed(() => Number(getCurrentInstance().parent.attrs.instanceIndex));

/**
 * 팝업창 출력 여부
 */
const isVisible = ref(false);

/**
 * 팝업창 "정상" 닫기
 */
const close = async (result) => {
  isVisible.value = false;
  setTimeout(() => {
    usePopup().close(id.value); // 팝업창 닫기
  }, 300);
  return instance.value.resolve(result);
};

/**
 * 팝업창 하루동안 열지않기
 */
const closeWithDay = async (result) => {
  isVisible.value = false;
  setTimeout(() => {
    usePopup().closeWithDay(id.value, 1); // 팝업창 닫기
  }, 300);
  return instance.value.resolve(result);
};

/**
 * 팝업창 "취소" 닫기
 */
const dismiss = async (result) => {
  isVisible.value = false;
  setTimeout(() => {
    usePopup().close(id.value); // 팝업창 닫기
  }, 300);
  return instance.value.reject(result);
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
    emit('init');
  }, 300);
});

/**
 * 부모 컴포넌트에서 접근할 수 있는 항목들
 */
defineExpose({
  id,
  close,
  dismiss,
});
</script>
