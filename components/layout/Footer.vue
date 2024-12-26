<template>
  <div>
    <footer
      class="bg-[#26282C] text-white/[0.6] break-keep pt-6 md:pt-12 pb-[50px] md:pb-[100px]"
    >
      <section class="w-full md:w-[1100px] mx-auto">
        <div
          class="flex text-sm md:text-base text-center md:text-left pb-6 border-white/25 *:transition-all border-b"
        >
          <a
            class="flex-1 md:flex-initial hover:bg-black md:mr-16 text-white"
            href="#"
            target="_blank"
          >
            <NuxtLink to="/terms/privacy"> 개인정보처리방침 </NuxtLink>
          </a>
          <a
            class="flex-1 md:flex-initial hover:bg-black md:mr-16"
            href="#"
            target="_blank"
            ><NuxtLink to="/terms/service">이용약관</NuxtLink></a
          >
          <a
            class="flex-1 md:flex-initial hover:bg-black"
            href="https://todaydiet.kr"
            v-if="!associateHospital"
            >가입문의</a
          >
        </div>

        <div
          class="md:flex items-start p-6 md:p-0 md:pt-9 text-sm md:font-light"
        >
          <img
            class="w-[35px] md:w-auto md:mr-6 mb-6"
            src="@/assets/images/main/footerCi.png"
            alt="ODA"
          />
          <ul class="flex-1">
            <li class="mb-3">
              <span>{{ infoObj.hospitalNm }}</span>
              <span class="border-l border-white/[0.6] ml-2.5 pl-2.5"
                >대표 {{ infoObj.ceo }}</span
              >
              <span class="border-l border-white/[0.6] ml-2.5 pl-2.5">{{
                infoObj.addr
              }}</span>
              <span class="border-l border-white/[0.6] ml-2.5 pl-2.5"
                >이메일
                <a :href="`mailto:${infoObj.email}`">{{
                  infoObj.email
                }}</a></span
              >
            </li>
            <li class="mb-6">
              <span>사업자등록번호 {{ infoObj.companyNumer }}</span>
              <span
                class="border-l border-white/[0.6] ml-2.5 pl-2.5"
                v-if="!associateHospital"
                >통신판매신고 제2024-서울종로-1090호</span
              >
            </li>
            <li>
              <span>Copyrightⓒ 오늘의 다이어트 All Rights Reserved.</span>
            </li>
          </ul>
        </div>
      </section>
      <section
        class="fixed flex items-center justify-between rounded-full backdrop-blur bg-black/[0.6] text-white z-40 bottom-3 left-1/2 translate-x-[-50%] w-[90%] md:w-[900px] h-[50px] md:h-[72px]"
      >
        <h1 class="md:text-xl ml-4 md:ml-[66px]">
          오늘의 다이어트 <span class="font-semibold">'오다'</span>
        </h1>
        <a
          class="md:text-xl mr-4 rounded-full font-bold text-center pt-1.5 md:pt-3 bg-[#FF6079] h-[35px] md:h-[50px] w-[150px] md:w-[267px] hover:bg-[#ff3e5c] transition-all"
          href="#"
        >
          <NuxtLink :to="url">한의원 상담신청</NuxtLink>
        </a>
      </section>
    </footer>
  </div>
</template>
<script setup>
// 라우터
const route = useRoute();
const hospitalNm = route.fullPath;

// 제휴 병원
const associateHospital = ref(false);

// URL
const url = ref();

// 정보
const infoObj = ref({
  hospitalNm: "오다한의원",
  ceo: "최학현",
  addr: "서울특별시 종로구 종로 265 (종로6가) 1층",
  email: "odadiet@gmail.com",
  companyNumer: "6279101006",
});

// 제휴 병원 체크
const checkAssociateHospital = () => {
  let sessionValue = sessionStorage.getItem("hospitalNm");
  if (sessionValue == null) {
    associateHospital.value = false;
    url.value = "/map";
  } else {
    associateHospital.value = true;
    // 추후 병원 추가시 가변성있게 변경
    url.value = `/hospital/135`;
    infoObj.value.hospitalNm = "코키아한방병원";
    infoObj.value.ceo = "김경호";
    infoObj.value.addr = "경기 파주시 와석순환로507 4~5층";
    infoObj.value.email = "kkhfh@naver.com";
    infoObj.value.companyNumer = "383-04-03216";
  }
};

checkAssociateHospital();
</script>
