import { uuid } from '~~/plugins/utils/string.utils';
import { getCookie, setCookie } from '~~/plugins/utils/cookie.utils';

export const usePopup = () => {
  /**
   * 팝업창 인스턴스
   */
  class PopupInstance {
    /**
     * 팝업창 인스턴스 아이디
     */
    id: string;
    /**
     * 팝업창 Vue 컴포넌트 이름
     */
    componentName: string;
    /**
     * 팝업창 props 데이터
     */
    propsData: object;
    /**
     * 콜백을 처리할 Promise resolve 함수
     */
    resolve: Function;
    /**
     * 콜백을 처리할 Promise reject 함수
     */
    reject: Function;
  }

  /**
   * 팝업창 인스턴스 맵
   */
  const instanceMap = useState<Map<string, PopupInstance>>('popup.instanceMap', () => new Map());

  /**
   * 팝업창 인스턴스 가져오기
   * @param id 팝업창 인스턴스 아이디
   */
  const getInstance = (id: string) => {
    return instanceMap.value.get(id);
  };

  /**
   * 팝업창 열기
   * @param id 팝업창 아이디
   * @param componentName 컴포넌트 이름
   * @param propsData 팝업창 props 데이터
   */
  const open = async (id: string, componentName: string, propsData?: object) => {
    // 하루동안 열지 않는 팝업창인지 쿠키로 확인
    const isClose = getCookie(`popup-${id}`);
    if (isClose) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      propsData = Object.assign({}, propsData);
      // 팝업창 인스턴스 생성
      const instance: PopupInstance = {
        id,
        componentName,
        propsData,
        resolve,
        reject,
      };
      // 생성된 팝업창 인스턴스를 등록
      instanceMap.value.set(id, instance);
    });
  };

  /**
   * 팝업창 닫기
   * @param id 팝업창 인스턴스 아이디
   */
  const close = async (id: string) => {
    instanceMap.value.delete(id);
  };

  /**
   * 지정한 일수 만큼 팝업창 닫기
   * @param id 팝업창 인스턴스 아이디
   * @param day 팝업창을 닫을 날짜 (기본값=1)
   */
  const closeWithDay = async (id: string, day: number = 1) => {
    setCookie(`popup-${id}`, true, 1);
    close(id);
  };

  /**
   * 모든 팝업창 닫기
   */
  const closeAll = async () => {
    instanceMap.value.clear();
  };

  return {
    PopupInstance,
    instanceMap,
    getInstance,
    open,
    alert,
    confirm,
    close,
    closeWithDay,
    closeAll,
  };
};
