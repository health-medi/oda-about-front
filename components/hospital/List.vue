<template>
  <section>
    <div class="relative max-w-lg mx-auto bg-white pb-2">
      <div class="flex items-center justify-between">
        <!-- 왼쪽 아이콘 -->
        <div class="pl-3">
          <UiIcon icon="mdi-chevron-left" size="32" @click="goBack()" />
        </div>

        <!-- 가운데 텍스트 -->
        <div class="text-lg absolute left-1/2 transform -translate-x-1/2">
          <h1>지역선택</h1>
        </div>

        <!-- 오른쪽 빈 공간 유지 -->
        <div class="pr-3 invisible">
          <!-- Right-side to maintain flex spacing -->
          <UiIcon icon="mdi-chevron-left" size="32" />
        </div>
      </div>
      <div class="py-1 px-5">
        <HospitalRegionList @regionSelected="handleRegionSelected" />
      </div>
    </div>
    <div class="p-6 bg-gray-100 max-w-lg mx-auto min-h-screen">
      <div v-for="item in hospitalList" :key="item.hsptSeq" class="py-2">
        <NuxtLink :to="`/hospital/${item.hsptSeq}`">
          <div class="border rounded-xl p-3 md:p-5 bg-white">
            <div class="flex justify-between">
              <div v-if="hasMedicalStaffImage(item)">
                <img
                  :src="getDoctorImageUrl(item)"
                  alt="의사 사진"
                  class="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border"
                />
              </div>
              <div class="items-start md:mr-4">
                <h2 class="text-lg md:text-xl font-bold text-left">
                  {{ item.hsptNm }}
                </h2>
                <!-- 진료 상태 표시 -->
                <span
                  v-if="getDiagnosisStatus(item) === '진료중'"
                  class="text-pink-500 text-sm md:text-md font-bold"
                >
                  상담가능
                </span>
                <span v-else class="text-gray-500 text-sm md:text-md font-bold">
                  상담 불가능
                </span>
                <div class="flex grid-cols-2 gap-2">
                  <span
                    v-if="medicalStaffName(item)"
                    class="text-gray-600 mt-1"
                  >
                    {{ medicalStaffName(item) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <UiIcon
                    icon="mdi-map-marker-outline"
                    size="20"
                    class="stroke-gray-500 mr-2"
                  />
                  <span class="text-sm text-left mt-1">
                    {{ limitString(item.hsptAddr, 9) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <UiIcon
                    icon="mdi-phone-outline"
                    size="20"
                    class="stroke-gray-500 mr-2"
                  />
                  <UiValueCommon
                    :value="item.counselingPhoneNo"
                    format="phone"
                  />
                </div>
              </div>
              <div class="flex items-center md:ml-20">
                <div
                  class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white"
                >
                  <UiIcon icon="mdi-arrow-right" size="20" />
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
<script setup>
import _ from "lodash";
import { limitString } from "@/plugins/utils/string.utils";
import noProfileImg from "@/assets/images/map/no-profile.png";

const props = defineProps({
  /**
   * 병원 목록
   */
  hospitalList: {
    type: Array,
  },
});

const router = useRouter();

// 부모에게 이벤트를 전달할 emit 정의
const emit = defineEmits(["update-region"]);

/**
 * 기본 병원 객체 가져오기
 */
const getDefaultHospital = () => {
  const defaultHospital = Object.assign(
    { attachBag: {} },
    _.cloneDeep(props.hospital)
  );
  return defaultHospital;
};

/**
 * 폼
 */
const { values: localHospital } = useForm({
  initialValues: {
    ...getDefaultHospital(),
  },
});

// 현재 요일 (일요일=0, 월요일=1 ... 토요일=6)
const currentDay = new Date().getDay();

// 현재 시간을 "HHmm" 형태로 가져오기
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}${minutes}`;
};

// 병원의 진료 상태를 반환하는 함수
const getDiagnosisStatus = (hospital) => {
  const todayDiagnosis = hospital.diagnosisInfoList.find(
    (info) => info.days === currentDay.toString()
  );

  // 진료 정보가 없거나 휴진일이면 "진료마감" 반환
  if (!todayDiagnosis || todayDiagnosis.dayOffYn === "Y") {
    return "진료마감";
  }

  const currentTime = getCurrentTime();

  // 진료 시간이 설정되어 있으면 비교하여 상태 결정
  if (todayDiagnosis.diagnosisStartTime && todayDiagnosis.diagnosisEndTime) {
    if (
      currentTime >= todayDiagnosis.diagnosisStartTime &&
      currentTime <= todayDiagnosis.diagnosisEndTime
    ) {
      return "진료중";
    }
  }

  return "진료마감";
};

// 자식 컴포넌트에서 이벤트를 받아 처리하는 함수
const handleRegionSelected = (id) => {
  emit("update-region", id);
};

const goBack = () => {
  router.go(-1);
};

// 의사 이미지가 있는지 여부를 확인하는 함수
const hasMedicalStaffImage = (item) => {
  return item.medicalStaffList?.[0]?.attachBag?.image?.[0]?.attachId != null;
};

// 의사의 이름을 반환하는 함수
const medicalStaffName = (item) => {
  return item.medicalStaffList?.[0]?.medicalStaffNm;
};

// 의사 이미지 URL을 반환하는 함수
const getDoctorImageUrl = (item) => {
  if (item && item.medicalStaffList) {
    return `/api/attach/view/${item.medicalStaffList?.[0]?.attachBag?.image?.[0]?.attachId}`;
  } else {
    return noProfileImg;
  }
};

const goHospital = (item) => {
  router.push(`/hospital/${item.hsptSeq}`);
};
</script>
