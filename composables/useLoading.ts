import nProgress from '@/plugins/nprogress.client';

export const useLoading = () => {
  const app = useNuxtApp();

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
    if (!app.ssrContext && count.value === 1) {
      nProgress.start();
    }
  };

  /**
   * 로딩 종료
   */
  const stopLoading = () => {
    if (count.value > 0) {
      count.value--;
    }
    if (!app.ssrContext && count.value === 0) {
      nProgress.done();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
