import { useToast as useVueToast } from "vue-toastification";
import UiToastDefault from "@/components/ui/toast/Default.vue";

class ToastConfig {
  /**
   * 제목
   */
  title?: string;
  /**
   * 메세지
   */
  msg: string;
  /**
   * 유형 ['default', info', 'error', 'warning', 'success']
   */
  type?: string;
  /**
   * 유지시간 (ms)
   * 기본값: 5000
   */
  timeout?: number | 3000;
}

export const useToast = () => {
  /**
   * 토스트 알림 열기
   * @param config 대화창 인스턴스 설정
   */
  const open = async ({ title, msg, type, timeout }: ToastConfig) => {
    return new Promise((resolve) => {
      const options = {
        component: UiToastDefault,
        props: { title, msg },
        timeout,
        onClose() {
          resolve(null);
        },
      };
      const toast = useVueToast();
      clear();
      if (type) {
        toast[type](options);
      } else {
        toast(options);
      }
    });
  };

  /**
   * 유효성 확인 실패 토스트 알림 열기
   */
  const noValid = async () => {
    clear();
    useToast().open({
      title: "다시 확인해 주세요!",
      msg: "잘못 입력된 항목이 있습니다.",
      type: "error",
    });
  };

  /**
   * 모든 토스트 알림 닫기
   */
  const clear = () => {
    useVueToast().clear();
  };

  return {
    open,
    noValid,
    clear,
  };
};
