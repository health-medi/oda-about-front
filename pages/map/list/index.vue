<template>
  <section class="min-h-screen max-w-screen">
    <HospitalList :hospitalList="hospitalList" @update-region="updateRegion" />
  </section>
</template>
<script setup>
/**
 * 병원 목록
 */
const hospitalList = ref(null);

/**
 * 목록 조회
 */
const fetchList = async (regionCd) => {
  try {
    const { data } = await useHospital().fetchList({
      conditions: [
        {
          key: "regionCd",
          value: regionCd == "000" || regionCd == undefined ? "" : regionCd,
        },
      ],
    });
    hospitalList.value = data;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * 지역 업데이트
 */
const updateRegion = (regionCd) => {
  fetchList(regionCd);
};
fetchList();
</script>
