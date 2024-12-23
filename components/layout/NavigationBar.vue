<template>
  <!-- NAV -->
  <nav
    :class="[
      'fixed md:relative transition duration-300 ease-in-out h-14 md:h-16 top-0 px-5 md:px-20 z-50 flex items-center w-full',
      isScrolled ? 'bg-white shadow-sm' : '',
    ]"
  >
    <div class="flex items-center justify-between w-full md:w-auto">
      <!-- 로고 -->
      <div>
        <a href="/" class="z-10">
          <!-- FIXME -->
          <img
            class="hidden md:block w-[206px]"
            src="@/assets/images/main/nav_ci.png"
            alt="ODA:아름다운 변화가 오다"
          />
          <img
            class="block md:hidden w-[54.5px]"
            src="@/assets/images/main/nav_ci2.png"
            alt="ODA"
          />
        </a>
      </div>

      <div class="flex">
        <!-- 메뉴 오픈 버튼 (navOpen) -->
        <div v-if="!isMenuOpen" class="block md:hidden" @click="toggleNavMenu">
          <img
            class="w-[24px]"
            src="@/assets/images/main/nav_btn1.png"
            alt="menu open"
          />
        </div>

        <!-- 메뉴 닫기 버튼 (navClose) -->
        <div v-else class="block md:hidden" @click="toggleNavMenu">
          <img
            class="w-[24px]"
            src="@/assets/images/main/nav_btn2.png"
            alt="menu close"
          />
        </div>
      </div>
    </div>

    <!-- 네비게이션 메뉴 (navMenu) -->
    <div
      v-show="isMenuOpen || !isMobile"
      class="top-12 md:top-0 left-0 w-full md:w-auto h-full md:h-auto fixed md:relative bg-white md:flex-auto text-center md:text-right"
    >
      <a
        class="block md:inline text-3xl md:text-base mt-[150px] md:mt-0 md:mr-10 text-[#2E2E2E] transition duration-300 ease-in-out hover:font-bold"
        href="#"
      >
        <NuxtLink to="/menu/sub-1" @click="toggleNavMenu"
          >다이어트 프로그램</NuxtLink
        >
      </a>
      <a
        class="block md:inline text-3xl md:text-base mt-12 md:mt-0 md:mr-10 text-[#2E2E2E] transition duration-300 ease-in-out hover:font-bold"
        href="#"
      >
        <NuxtLink to="/menu/sub-2" @click="toggleNavMenu"
          >진료 프로세스</NuxtLink
        >
      </a>
      <a
        class="block md:inline text-3xl md:text-base mt-12 md:mt-0 text-[#2E2E2E] transition duration-300 ease-in-out hover:font-bold"
        href="#"
        v-if="!associateHospital"
      >
        <NuxtLink to="/map">지점 안내</NuxtLink>
      </a>
    </div>
  </nav>
</template>

<script setup>
// 메뉴 상태 관리
const isScrolled = ref(false);
const isMenuOpen = ref(false);
const isMobile = ref(false);

// 라우터
const route = useRoute();
const hostpitalNm = route.fullPath;

// 제휴 병원
const associateHospital = ref(false);

// 메뉴 토글 함수
const toggleNavMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 화면 크기 체크
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768; // 768px 이하일 때 모바일로 간주
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const scrollPosition = window.scrollY;
  isScrolled.value = scrollPosition > 10;
};

// 제휴 병원 체크
const checkAssociateHospital = () => {
  if (hostpitalNm.indexOf("@") > 0) {
    associateHospital.value = true;
  } else {
    associateHospital.value = false;
  }
};

// mounted 시점에 화면 크기를 체크하고 리스너 추가
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  window.addEventListener("scroll", handleScroll);
  checkAssociateHospital();
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
