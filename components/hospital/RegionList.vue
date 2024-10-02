<template>
  <div class="overflow-x-auto scrollbar-hide">
    <ul class="flex gap-2">
      <li
        v-for="region in regions"
        :key="region.id"
        :class="[
          'px-4 py-2 rounded-3xl cursor-pointer whitespace-nowrap border',
          selectedRegion === region.id
            ? 'border-pink-500 text-pink-500 bg-pink-100'
            : 'border-gray-300 text-gray-700 bg-white',
        ]"
        class="text-sm md:text-md"
        @click="selectRegion(region.id)"
      >
        {{ region.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const regions = [
  { id: "000", name: "전국" },
  { id: "001", name: "서울" },
  { id: "002", name: "인천/경기" },
  { id: "003", name: "부산/경남" },
  { id: "004", name: "대구/경북" },
  { id: "005", name: "광주/전라" },
  { id: "006", name: "대전/충청" },
  { id: "007", name: "강원" },
  { id: "008", name: "제주" },
];

// 부모 컴포넌트에 값을 전달하기 위해 emit 설정
const emit = defineEmits(["regionSelected"]);

const selectedRegion = ref("000"); // 기본값으로 '전국'을 선택

// 지역 선택
const selectRegion = (id) => {
  // '전국'이 선택된 경우 모든 다른 선택을 초기화
  if (id === "000") {
    selectedRegion.value = "000";
  } else {
    selectedRegion.value = selectedRegion.value === id ? "000" : id; // 클릭 시 토글 (다른 지역이 선택되면 '전국'이 해제)
  }
  emit("regionSelected", selectedRegion.value);
};
</script>
