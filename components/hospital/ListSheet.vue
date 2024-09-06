<template>
  <div class="bottom-sheet-overlay">
    <div class="bottom-sheet" @click.stop>
      <div class="bottom-sheet-content pt-4">
        <div v-for="item in hospitalList" :key="item.id" class="py-2">
          <NuxtLink :to="`/hospital/${item.hsptSeq}`">
            <div class="border rounded-xl p-5">
              <div class="flex justify-between">
                <div v-if="hasMedicalStaffImage(item)">
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
        <button
          @click="$emit('close')"
          class="w-full py-2 mt-4 text-center bg-gray-200 rounded-lg hover:bg-black hover:text-white"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hospitalList: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

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
  return `/api/attach/view/${item.medicalStaffList?.[0]?.attachBag?.image?.[0]?.attachId}`;
};

const goHospital = (item) => {
  router.push(`/hospital/${item.hsptSeq}`);
};
</script>

<style scoped>
.bottom-sheet-overlay {
  position: fixed;
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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  z-index: 11;
}

.bottom-sheet-content {
  max-height: calc(80vh - 40px);
  overflow-y: auto;
}
</style>
