<template>
  <div class="bottom-sheet-overlay" @click="$emit('close')">
    <div class="bottom-sheet" @click.stop>
      <div class="bottom-sheet-content p-4">
        <div class="flex items-center mb-4">
          <div class="flex-grow">
            <h2 class="text-2xl font-bold">{{ hospitalName }}</h2>
            <span
              v-if="hasMedicalStaffImage"
              class="bg-[#fdd3e1] text-[#FF4E8B] font-bold rounded-lg px-2 py-1 inline-block mt-1"
            >
              {{ majorSubject }}
            </span>
            <p v-if="hasMedicalStaffImage" class="text-gray-600 mt-1">
              {{ medicalStaffName }}
            </p>
          </div>
          <img
            v-if="hasMedicalStaffImage"
            :src="doctorImageUrl"
            alt="의사 사진"
            class="w-16 h-16 rounded-full object-cover ml-4 border"
          />
        </div>

        <div class="mb-4">
          <p
            :class="{
              'text-[#FF4E8B] font-bold mb-2':
                consultationStatus.status === 'available',
              'text-gray-500 font-bold mb-2':
                consultationStatus.status === 'unavailable',
            }"
          >
            {{ consultationStatus.message }}
          </p>
          <div class="flex items-center text-gray-600 mb-2">
            <UiIcon
              icon="mdi-map-marker-outline"
              size="20"
              class="stroke-gray-500 mr-2"
            />
            <span>{{ hospital.hsptAddr }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <UiIcon
              icon="mdi-phone-outline"
              size="20"
              class="stroke-gray-500 mr-2"
            />
            <a
              :href="
                hospital.counselingPhoneNo
                  ? `tel:${hospital.counselingPhoneNo}`
                  : '#'
              "
            >
              <UiValueCommon
                :value="hospital.counselingPhoneNo"
                format="phone"
              />
            </a>
          </div>
        </div>
        <NuxtLink :to="`/hospital/${hospital.hsptSeq}`">
          <UiButton
            text="이한의원에 상담 신청"
            size="xl"
            class="w-full"
            variant="primary"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  hospital: {
    type: Object,
    required: true,
  },
});

// 병원명
const hospitalName = computed(() => props.hospital.hsptNm);

// 의사 이미지가 있는지 여부
const hasMedicalStaffImage = computed(() => {
  return (
    props.hospital?.medicalStaffList[0]?.attachBag?.image[0]?.attachId != null
  );
});

// 의사 정보
const majorSubject = computed(
  () => props.hospital?.medicalStaffList[0].majorSubject
);
const medicalStaffName = computed(
  () => props.hospital?.medicalStaffList[0].medicalStaffNm
);
const doctorImageUrl = computed(
  () =>
    `/api/attach/view/${props.hospital?.medicalStaffList[0]?.attachBag?.image[0]?.attachId}`
);

// 상담 가능 상태 계산
const consultationStatus = computed(() => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const dayMap = { 0: "7", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" };
  const todayInfo = props.hospital.diagnosisInfoList.find(
    (info) => info.days === dayMap[currentDay.toString()]
  );

  if (todayInfo && todayInfo.diagnosisStartTime && todayInfo.diagnosisEndTime) {
    const startTime = parseInt(todayInfo.diagnosisStartTime);
    const endTime = parseInt(todayInfo.diagnosisEndTime);

    if (currentTime >= startTime && currentTime <= endTime) {
      return {
        status: "available",
        message: `상담 가능 · ${formatTime(endTime)} 상담 종료`,
      };
    } else if (currentTime < startTime) {
      return {
        status: "unavailable",
        message: `상담 불가능 · 상담은 ${formatTime(
          startTime
        )}부터 시작됩니다.`,
      };
    } else {
      return {
        status: "unavailable",
        message: `상담 불가능 · 상담은 ${formatTime(
          endTime
        )}에 종료되었습니다.`,
      };
    }
  }

  return {
    status: "unavailable",
    message: "상담 불가능 · 오늘은 상담 시간이 없습니다.",
  };
});

// 시간 포맷팅 함수
const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${period} ${formattedHours}:${minutes.toString().padStart(2, "0")}`;
};
</script>

<style scoped>
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: flex-end;
}

.bottom-sheet {
  background-color: white;
  width: 100%;
  max-height: 80vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.bottom-sheet-content {
  max-height: calc(80vh - 40px);
  overflow-y: auto;
}
</style>
