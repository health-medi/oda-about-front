<template>
  <div class="relative h-screen">
    <div class="flex justify-center h-full">
      <div class="relative justify-start">
        <div
          class="absolute left-14 md:left-5 transform -translate-y-1/2 mt-10 z-10"
        >
          <div
            class="w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white text-black cursor-pointer border-[1px] border-gray-300"
          >
            <UiIcon icon="mdi-chevron-left" size="35" @click="goBack()" />
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <button
          @click="toggleBottomSheet()"
          class="absolute top-4 bg-white text-black px-4 py-3 rounded-3xl shadow-lg hover:font-bold z-10 cursor-pointer border-[1px] border-gray-300"
        >
          <UiIcon icon="mdi-menu" />
          목록 보기
        </button>
        <HospitalListSheet
          v-if="isHospitalListSheetVisible"
          :hospitalList="hospitalListView"
          :style="bottomSheetStyle"
          @close="onCloseListSheet"
        />
        <div
          id="map"
          ref="mapContainer"
          class="py-1 px-2 md:max-w-[460px] h-full w-[460px] sm:h-full flex z-0"
        ></div>
      </div>
      <div class="relative justify-end">
        <div
          class="absolute right-10 md:right-5 transform -translate-y-1/2 mt-10 z-5"
        >
          <div
            class="bg-white text-black px-4 py-3 rounded-3xl shadow-lg hover:font-bold w-28 cursor-pointer border-[1px] border-gray-300"
          >
            <NuxtLink to="/map/list"
              >지역선택 <UiIcon icon="mdi-chevron-down"
            /></NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!-- Bottom Sheet 컴포넌트 -->
    <MapBottomSheet
      v-if="isBottomSheetVisible"
      :hospital="selectedHospital"
      :style="bottomSheetStyle"
      @close="onCloseSheet"
    />
  </div>
</template>

<script setup>
import pinImage from "@/assets/images/map/mapBtnPin.png";

const props = defineProps({
  /**
   * X 좌표값 (경도)
   */
  positionX: {
    type: Number,
    required: true,
  },
  /**
   * Y 좌표값 (위도)
   */
  positionY: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

const localPositionX = ref(null);
const localPositionY = ref(null);
const map = ref(null);
const markers = ref([]);
const selectedHospital = ref(null);
const hospitalListView = ref([]);
const isHospitalListSheetVisible = ref(false);
const isBottomSheetVisible = ref(false);
const mapContainer = ref(null);

const onCloseListSheet = (status) => {
  isHospitalListSheetVisible.value = status !== undefined ? status : false;
  // isHospitalListSheetVisible.value = !isHospitalListSheetVisible.value;
};

const onCloseSheet = () => {
  isBottomSheetVisible.value = !isBottomSheetVisible.value;
};

const bottomSheetStyle = reactive({
  width: "0px",
  height: "0px",
  top: "0px",
  left: "0px",
});

// bottomSheetStyle을 업데이트하는 함수
const updateBottomSheetStyle = () => {
  if (mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect();
    bottomSheetStyle.width = `${rect.width}px`;
    bottomSheetStyle.height = `${rect.height}px`;
    bottomSheetStyle.top = `${rect.top}px`;
    bottomSheetStyle.left = `${rect.left}px`;
  }
};

// watch를 사용해 mapContainer 크기를 실시간으로 감시
watch(
  () => mapContainer.value?.getBoundingClientRect(),
  (newRect) => {
    if (newRect) {
      bottomSheetStyle.width = `${newRect.width}px`;
      bottomSheetStyle.height = `${newRect.height}px`;
      bottomSheetStyle.top = `${newRect.top}px`;
      bottomSheetStyle.left = `${newRect.left}px`;
    }
  }
);

const emit = defineEmits(["update"]);

/**
 * 하단 sheet
 */
const toggleBottomSheet = () => {
  isHospitalListSheetVisible.value = !isHospitalListSheetVisible.value;
};

/**
 * 병원 목록을 조회하고 마커를 업데이트하는 함수
 */
const fetchHospital = async () => {
  try {
    // 현재 맵의 보이는 영역(Bounds) 가져오기
    const bounds = map.value.getBounds();
    const swLatLng = bounds.getSouthWest(); // 좌하단 좌표
    const neLatLng = bounds.getNorthEast(); // 우상단 좌표

    // 좌표를 조건으로 병원 목록 조회
    const { data } = await useHospital().fetchMapList({
      conditions: [
        { key: "swLng", value: swLatLng.getLng() }, // 좌하단 경도
        { key: "swLat", value: swLatLng.getLat() }, // 좌하단 위도
        { key: "neLng", value: neLatLng.getLng() }, // 우상단 경도
        { key: "neLat", value: neLatLng.getLat() }, // 우상단 위도
      ],
    });

    const hospitalList = data;
    hospitalListView.value = data;

    // 기존 마커를 검사하여 맵 영역 밖에 있는 마커 제거
    markers.value = markers.value.filter((marker) => {
      if (bounds.contain(marker.getPosition())) {
        return true; // 맵 영역 내에 있는 마커는 유지
      } else {
        marker.setMap(null); // 맵 영역 밖에 있는 마커는 제거
        return false;
      }
    });

    // 새로운 병원 데이터에 대해 마커 추가
    hospitalList.forEach((hospital) => {
      const imageSize = new kakao.maps.Size(30, 30); // 마커 이미지 크기
      const imageOption = { offset: new kakao.maps.Point(25, 50) }; // 마커의 중심좌표 설정

      // 마커 이미지 생성
      const markerImage = new kakao.maps.MarkerImage(
        pinImage,
        imageSize,
        imageOption
      );

      // 마커 생성
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(hospital.locYPos, hospital.locXPos),
        image: markerImage, // 커스텀 마커 이미지 설정
        map: map.value,
      });

      // 마커 클릭 이벤트 추가
      kakao.maps.event.addListener(marker, "click", () => {
        selectedHospital.value = hospital;
        isBottomSheetVisible.value = true;
      });

      markers.value.push(marker);
    });
  } catch (error) {
    console.error("Failed to fetch hospitalList:", error);
  }
};

/**
 * 카카오 지도 초기화
 */
const initMap = () => {
  const mapContainer = document.getElementById("map");

  navigator.geolocation.getCurrentPosition((pos) => {
    localPositionX.value = pos.coords.longitude;
    localPositionY.value = pos.coords.latitude;

    const mapOption = {
      center: new kakao.maps.LatLng(localPositionY.value, localPositionX.value),
      level: 4,
    };

    // 지도 객체 생성
    map.value = new kakao.maps.Map(mapContainer, mapOption);

    // 초기 병원 목록 조회
    fetchHospital();

    // 지도 이동 이벤트 등록
    kakao.maps.event.addListener(map.value, "center_changed", () => {
      const center = map.value.getCenter();
      localPositionX.value = center.getLng();
      localPositionY.value = center.getLat();
    });

    // 지도 줌 레벨 변경 시 데이터 재조회
    kakao.maps.event.addListener(map.value, "zoom_changed", () => {
      const center = map.value.getCenter();
      localPositionX.value = center.getLng();
      localPositionY.value = center.getLat();
      fetchHospital();
    });

    // 지도 클릭 이벤트 등록 (마커 이동)
    kakao.maps.event.addListener(map.value, "click", function (mouseEvent) {
      let latlng = mouseEvent.latLng;
      localPositionX.value = latlng.getLng();
      localPositionY.value = latlng.getLat();
      emit("update", {
        positionX: localPositionX.value,
        positionY: localPositionY.value,
      });
    });
  });
};

/**
 * 카카오 지도 스크립트 등록
 */
const config = useRuntimeConfig();
const addScript = () => {
  const script = document.createElement("script");
  script.onload = () => kakao.maps.load(initMap);
  const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.KAKAOMAP_APIKEY}&autoload=false`;
  script.src = scriptUrl;
  document.head.appendChild(script);
};

/**
 * 뒤로가기
 */
const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  window.addEventListener("resize", updateBottomSheetStyle);

  localPositionX.value = props.positionX;
  localPositionY.value = props.positionY;

  setTimeout(() => {
    addScript();
  }, 500);

  // 위치 값이 초기화된 후에 병원 목록을 가져오도록 수정
  watch([localPositionX, localPositionY], ([newX, newY]) => {
    if (newX && newY) {
      fetchHospital(newX, newY);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBottomSheetStyle);
});
</script>
