import { useApi } from '@/composables/useApi';

/**
 * 코드
 */
class Code {
  /**
   * 코드 값
   */
  code: string;
  /**
   * 코드 이름
   */
  name: string;
}

export const useCode = async () => {
  const { $get } = useApi();

  /**
   * 코드 맵
   */
  const codeMap = useState<Object>('code.codeMap', () => ({}));

  /**
   * 코드 값으로 코드명 가져오기
   */
  const getName = (key: string, code: string) => {
    let codeName = null;
    codeMap.value[key].some((codeItem: Code) => {
      if (codeItem.code === code) {
        codeName = codeItem.name;
      }
      return !!codeName;
    });
    return codeName;
  };

  /**
   * 서버에서 코드 목록 가져오기
   */
  const fetchCodeList = async () => {
    try {
      const { data } = await $get('/api/common/code', {
        silence: true,
      });
      codeMap.value = data;
    } finally {
      return Promise.resolve(true);
    }
  };

  if (Object.keys(codeMap.value).length === 0) {
    await fetchCodeList();
  }

  return {
    codeMap,
    getName,
  };
};
