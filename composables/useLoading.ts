// composables/useLoading.ts
import { useNuxtApp } from '#app';

export const useLoading = () => {
  const { $nProgress } = useNuxtApp(); // nProgress를 가져옵니다.

  /**
   * 로딩 개수
   */
  const count = useState<number>('loading.count', () => 0);

  /**
   * 로딩 여부
   */
  const isLoading = computed(() => count.value > 0);

  /**
   * 로딩 시작
   */
  const startLoading = () => {
    count.value++;
    if (count.value === 1) {
      $nProgress.start(); // nProgress를 사용하여 로딩 시작
    }
  };

  /**
   * 로딩 종료
   */
  const stopLoading = () => {
    if (count.value > 0) {
      count.value--;
    }
    if (count.value === 0) {
      $nProgress.done(); // nProgress를 사용하여 로딩 종료
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
