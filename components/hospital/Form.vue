<template>
  <div>
    <div class="relative max-w-lg mx-auto bg-white">
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 mt-2">
        <UiIcon icon="mdi-chevron-left" size="32" @click="goBack()" />
      </div>
      <div class="text-center text-lg pt-3">
        <h1>한의원 상담 신청</h1>
      </div>
    </div>
    <div class="p-6 bg-white max-w-lg mx-auto min-h-screen">
      <h2 class="text-xl font-bold mb-2">
        <UiValueCommon :value="localHospital.hsptNm" />
      </h2>
      <div class="flex items-center text-gray-500">
        <UiIcon icon="mdi-clock-outline" size="20" class="mr-2" />
        <span
          :class="{
            'text-[#FF4E8B] font-bold':
              consultationStatus.status === 'available',
            'text-gray-500 font-bold':
              consultationStatus.status === 'unavailable',
          }"
        >
          {{ consultationStatus.message }}</span
        >
      </div>
      <div class="flex items-center text-gray-500">
        <UiIcon icon="mdi-map-marker-outline" size="20" class="mr-2" />
        <UiValueCommon :value="localHospital.hsptAddr" />
      </div>
      <div class="flex items-center text-gray-500 mb-5">
        <UiIcon icon="mdi-phone-outline" size="20" class="mr-2" />
        <a :href="`tel:${localHospital.counselingPhoneNo}`">
          <UiValueCommon
            :value="localHospital.counselingPhoneNo"
            format="phone"
          />
        </a>
      </div>
      <div class="flex items-center mb-5" v-if="localHospital.medicalStaffList">
        <img
          :src="getProfileImageSrc(localHospital)"
          alt="의사 사진"
          class="w-16 h-16 rounded-full object-cover border mr-4"
        />
        <div>
          <span
            v-if="localHospital.medicalStaffList?.[0]?.majorSubject"
            class="bg-[#fdd3e1] text-[#FF4E8B] font-bold rounded-md px-1 py-1 inline-block mt-1 text-xs"
          >
            {{ localHospital.medicalStaffList?.[0]?.majorSubject }}
          </span>
          <h3 class="text-md font-bold text-gray-500 mt-1">
            {{ localHospital.medicalStaffList?.[0]?.medicalStaffNm }}
          </h3>
        </div>
      </div>
      <div
        class="bg-gray-100 p-4 rounded-lg text-gray-700 mb-5 text-sm font-bold"
        v-if="localHospital.hsptIntro != null"
      >
        “{{ localHospital.hsptIntro }}”
      </div>
      <div class="mb-10">
        <UiButton
          type="button"
          text="상담 시간 보기"
          size="md"
          class="rounded-3xl w-full"
          prefixIcon="mdi-clock-outline"
          @click="showTimeTable()"
        />
      </div>
      <UiDivider class="mb-10" />
      <div class="application-info">
        <UiFormLabel text="신청 정보" class="font-bold text-gray-500 mb-5" />
        <h3 class="text-md mb-6">
          연락처를 남겨주세요. 한의원에서 확인 후 연락드립니다.
        </h3>
        <ValidateForm :validation-schema="validationSchema" @submit="onSubmit">
          <div class="mb-5">
            <UiFormLabel text="이름" class="text-gray-500 font-bold" required />
            <UiInput type="text" placeholder="본인 이름" name="usrNm" />
          </div>
          <div>
            <UiFormLabel
              text="휴대폰 번호"
              class="text-gray-500 font-bold"
              required
            />
            <UiInput type="phone" placeholder="11자리 숫자" name="phoneNo" />
          </div>
          <div class="flex items-center">
            <UiCheckbox
              id="contact-type-checkbox"
              name="contactType"
              true-value="T"
              false-value="C"
              >통화 대신 문자나 카톡으로 받기</UiCheckbox
            >
          </div>
          <UiButton
            type="submit"
            text="상담 신청 완료하기"
            variant="primary"
            size="xl"
            class="rounded-3xl w-full"
            block
          />
        </ValidateForm>
      </div>
      <HospitalTimeTableSheet
        :diagnosisInfo="localHospital.diagnosisInfoList"
        v-if="isSchedule"
        @close="isSchedule = false"
      />
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import defaultImage from "@/assets/images/map/no-profile.png";

const props = defineProps({
  /**
   * 병원 객체
   */
  hospital: {
    type: Object,
  },
});

const router = useRouter();

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

/**
 * 유효성 확인 스키마
 */
const validationSchema = useYup()
  .object()
  .shape({
    usrNm: useYup().string().label("이름").required(),
    phoneNo: useYup().string().label("전화번호").required(),
  });

/**
 * 폼 전송
 */
const onSubmit = async ({ usrNm, phoneNo, contactType }) => {
  const counseling = {
    hsptSeq: localHospital.hsptSeq,
    usrNm: usrNm,
    phoneNo: phoneNo,
    contactType: contactType == false ? "C" : "T",
  };
  try {
    await useCounselingInfo().createItem(counseling);
    useToast().clear();
    useToast().open({
      title: "신청 성공!",
      msg: "상담 신청이 완료되었습니다.",
      type: "success",
    });
    router.push("/map");
  } catch {}
  return Promise.resolve();
};

const isSchedule = ref(false);

const showTimeTable = () => {
  if (localHospital?.diagnosisInfoList) {
    isSchedule.value = true;
  } else {
    alert("상담시간 없음");
    isSchedule.value = false;
  }
};

const goBack = () => {
  router.go(-1);
};

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

/**
 * 의사사진
 */
const getProfileImageSrc = (localHospital) => {
  return localHospital.medicalStaffList?.[0]?.attachBag?.image?.[0]?.attachId
    ? `/api/attach/view/${localHospital.medicalStaffList[0].attachBag.image[0].attachId}`
    : defaultImage;
};

// 시간 포맷팅 함수
const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${period} ${formattedHours}:${minutes.toString().padStart(2, "0")}`;
};
</script>
