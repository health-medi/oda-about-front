<template>
  <div
    class="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-10"
    @click="$emit('close')"
  >
    <div class="w-full max-w-md p-4 bg-white rounded-t-2xl shadow-lg">
      <h3 class="text-lg font-semibold text-center mb-4">상담 가능 시간</h3>
      <div class="grid grid-cols-7 text-center text-sm">
        <div v-for="(day, index) in daysOfWeek" :key="index" class="py-2">
          <span
            :class="{
              'text-red-500': index === 6,
              'text-blue-500': index === 5,
            }"
          >
            {{ day }}
          </span>
        </div>
        <div
          v-for="(time, index) in props.diagnosisInfo"
          :key="index"
          class="py-2"
        >
          <template v-if="time.dayOffYn === 'N'">
            <span v-if="time.diagnosisStartTime && time.diagnosisEndTime">
              {{ formatTime(time.diagnosisStartTime) }}<br />~<br />{{
                formatTime(time.diagnosisEndTime)
              }}
            </span>
            <!-- <span v-if="time.lunchStartTime && time.lunchEndTime" class="block mt-1 text-xs text-gray-500">
              (점심 {{ formatTime(time.lunchStartTime) }}<br />~<br />{{ formatTime(time.lunchEndTime) }})
            </span> -->
          </template>
          <span v-else class="text-gray-400">휴무</span>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="w-full py-2 mt-4 text-center bg-gray-200 rounded-lg hover:bg-black hover:text-white"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  diagnosisInfo: {
    type: Array,
    required: true,
  },
});

// 요일에 해당하는 배열 (월요일이 첫 번째)
const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

// 시간 포맷팅 함수
const formatTime = (time) => {
  return time ? `${time.slice(0, 2)}:${time.slice(2, 4)}` : "";
};

const emit = defineEmits(["close"]);
</script>
