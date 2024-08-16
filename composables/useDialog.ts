import { uuid } from '~~/plugins/utils/string.utils';

export const useDialog = () => {
  /**
   * 대화창 인스턴스
   */
  class DialogInstance {
    /**
     * 대화창 인스턴스 아이디
     */
    id: string;
    /**
     * 대화창 Vue 컴포넌트 이름
     */
    componentName: string;
    /**
     * 대화창 props 데이터
     */
    propsData: object;
    /**
     * 대화창 설정
     */
    config: DialogInstanceConfig;
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
   * 대화창 인스턴스 설정
   */
  class DialogInstanceConfig {
    /**
     * 대화창 타입 [info|success|warning|danger|confirm|default]
     */
    type?: string;
    /**
     * 대화창 class attribute
     */
    classes?: string;
  }

  /**
   * 대화창 인스턴스 목록
   */
  const instanceList = useState<Array<DialogInstance>>('dialog.instanceList', () => []);

  /**
   * 대화창 인스턴스를 아이디로 가져오기
   * @param id 대화창 인스턴스 아이디
   */
  const getInstance = (id: string) => {
    let targetInstance = null;
    instanceList.value.some((instance) => {
      if (instance.id === id) {
        targetInstance = instance;
      }
      return targetInstance;
    });
    return targetInstance;
  };

  /**
   * 대화창 열기
   * @param componentName 컴포넌트 이름
   * @param propsData 대화창 props 데이터
   * @param config 대화창 인스턴스 설정
   */
  const open = async (componentName: string, propsData?: object, config?: DialogInstanceConfig) => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      propsData = Object.assign({}, propsData);
      config = Object.assign(
        {
          classes: '',
        },
        config,
      );
      // 대화창 인스턴스 생성
      const instance: DialogInstance = {
        id,
        componentName,
        propsData,
        config,
        resolve,
        reject,
      };
      // 생성된 대화창 인스턴스를 목록에 등록
      instanceList.value.push(instance);
    });
  };

  /**
   * 경고(Alert) 대화창 열기
   * @param msg 메세지
   * @param title 제목
   * @param type 타입
   * @param closeButtonName 확인 버튼 이름
   */
  const alert = async (msg: string, type?: string, title?: string, closeButtonName?: string) => {
    if (!type) {
      type = 'info';
    }
    if (!title) {
      switch (type) {
        case 'success':
          title = '성공';
          break;
        case 'warning':
          title = '경고';
          break;
        case 'danger':
          title = '오류';
          break;
        case 'confirm':
          title = '확인 필요';
          break;
      }
    }
    const propsData = {
      msg,
      title,
      closeButtonName,
    };
    return open('ui/dialog/Alert', propsData, { type });
  };

  /**
   * 확인(Confirm) 대화창 열기
   * @param title 제목
   * @param type 타입
   * @param msg 메세지
   * @param closeButtonName 확인 버튼 이름
   * @param dismissButtonName 취소 버튼 이름
   */
  const confirm = async (
    msg: string,
    type?: string,
    title?: string,
    closeButtonName?: string,
    dismissButtonName?: string,
  ) => {
    if (!type) {
      type = 'confirm';
    }
    if (!title) {
      switch (type) {
        case 'success':
          title = '성공';
          break;
        case 'warning':
          title = '경고';
          break;
        case 'danger':
          title = '오류';
          break;
        case 'confirm':
          title = '확인 필요';
          break;
      }
    }
    const propsData = {
      msg,
      title,
      closeButtonName,
      dismissButtonName,
    };
    return open('ui/dialog/Confirm', propsData, { type });
  };

  /**
   * 대화창 닫기
   * @param id 대화창 인스턴스 아이디
   */
  const close = async (id: string) => {
    const targetIndex = instanceList.value.findIndex((instanceItem) => instanceItem.id === id);
    if (targetIndex >= 0) {
      instanceList.value.splice(targetIndex, 1);
    }
  };

  /**
   * 모든 대화창 닫기
   */
  const closeAll = async () => {
    instanceList.value = [];
  };

  return {
    DialogInstance,
    instanceList,
    getInstance,
    open,
    alert,
    confirm,
    close,
    closeAll,
  };
};
