<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-end"
    @click="closeSheet"
  >
    <div
      class="bg-white w-full max-h-[80vh] rounded-t-2xl p-5 shadow-md z-11"
      @click.stop
    >
      <div class="max-h-[calc(80vh-40px)] overflow-y-auto">
        <div v-for="item in hospitalList" :key="item.id" class="py-2">
          <NuxtLink :to="`/hospital/${item.hsptSeq}`">
            <div class="border rounded-xl p-5">
              <div class="flex justify-between">
                <div>
                  <img
                    :src="getDoctorImageUrl(item)"
                    alt="의사 사진"
                    class="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
                <div class="items-start mr-4">
                  <h2 class="text-lg font-bold text-left">
                    {{ item.hsptNm }}
                  </h2>
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
                <div class="flex items-center ml-20">
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
        <div v-if="hospitalList.length === 0">
          해당 지역에 한의원이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { limitString } from "@/plugins/utils/string.utils";
import noProfileImg from "@/assets/images/map/no-profile.png";
const props = defineProps({
  hospitalList: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const emit = defineEmits(["close"]);

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
  return item.medicalStaffList?.[0]?.attachBag?.image?.[0]?.attachId
    ? `/api/attach/view/${item.medicalStaffList[0].attachBag.image[0].attachId}`
    : noProfileImg;
};

const goHospital = (item) => {
  router.push(`/hospital/${item.hsptSeq}`);
};

const closeSheet = () => {
  emit("close", false);
};
</script>
