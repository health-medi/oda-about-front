import * as _ from 'lodash';

export const useScroll = () => {
  /**
   * 화면 높이
   */
  const screenHeight = useState('screenHeight', () => 0);

  /**
   * 중단점
   */
  const breakPoint = ref(screenHeight.value * 8);
  /**
   * 화면 너비
   */
  const screenWidth = useState('screenWidth', () => 0);

  const isPc = screenWidth.value > 768 ? true : false;
  /**
   * 스크롤 높이
   */
  const yOffset = useState('yOffset', () => 0);

  const isActive = useState('isActive', () => false);

  const onscroll = () => {
    screenWidth.value > 768 ? scrollPos() : mobilePos();
  };

  const mobilePos = () => {
    yOffset.value = window.scrollY;

    window.addEventListener('touchstart', _.throttle(setStatus, 10));
    window.addEventListener('touchend', _.throttle(setStatus, 50));
    window.addEventListener('touchmove', _.throttle(setStatus, 50));
  };

  const scrollPos = () => {
    yOffset.value = window.scrollY;
    window.addEventListener('scroll', _.throttle(setStatus, 100));
  };

  /**
   *
   */
  const setStatus = () => {
    let prev = screenHeight.value;
    let curr = window.scrollY;

    if (prev < curr) {
      // 현재 스크롤 위치값이 화면 높이값 보다 클 때 ,
      isActive.value = true;
    } else {
      // 현재 스크롤 위치값이 화면 높이값보다 작을 때 ,
      isActive.value = false;
    }
    if (curr === 0) {
      isActive.value = false;
    }
  };

  const goTop = () => {
    yOffset.value = window.scrollY;

    const el = document.getElementById('intro');
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    scrollPos();
  };

  const goService = () => {
    const el = document.getElementById('description');
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    yOffset.value = window.scrollY;
    onscroll();
  };

  const goAdvert = () => {
    window.open('https://bbeu.co.kr/');
  };

  return {
    screenHeight,
    screenWidth,
    yOffset,
    isActive,
    breakPoint,
    onscroll,
    goTop,
    goService,
    goAdvert,
  };
};
