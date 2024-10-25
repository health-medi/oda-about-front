<template>
  <section class="min-h-screen max-w-screen">
    <HospitalForm :hospital="hospital" v-if="hospital" @submit="onSubmit" />
  </section>
</template>

<script setup>
// 이 페이지에서는 레이아웃을 사용하지 않도록 설정
definePageMeta({
  layout: false,
});
/**
 * 입력받은 병원 일련번호
 */
const hsptSeq = useRoute().params.hsptSeq;

/**
 * 병원 객체
 */
const hospital = ref(null);

/**
 * 상세 조회
 */
const fetchItem = async () => {
  try {
    hospital.value = null;
    const { data } = await useHospital().fetchItem(hsptSeq);
    hospital.value = data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// fetchItem 호출
fetchItem();
</script>
