import axios, { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import { useToast } from '@/composables/useToast';
import { useLoading } from '@/composables/useLoading';

/**
 * 요청 설정 인터페이스
 */
interface ReqeustConfig extends AxiosRequestConfig<any> {
  /**
   * post/put에서 attach = true이면 FormData 전송
   */
  attach?: boolean;
  /**
   * silence = true이면 로딩 처리 및 결과 메세지 출력 안함
   */
  silence?: boolean;
}

/**
 * GET RestAPI 호출
 * @param url URL
 * @param config 설정
 */
const $get = async (url: string, config?: ReqeustConfig) => {
  if (!config) {
    config = {};
  }
  config.url = url;
  config.method = 'GET';
  return await call(config);
};

/**
 * POST RestAPI 호출
 * @param url URL
 * @param config 설정
 */
const $post = async (url: string, config?: ReqeustConfig) => {
  if (!config) {
    config = {};
  }
  setAttachConfig(config);
  config.url = url;
  config.method = 'POST';
  return await call(config);
};

/**
 * PUT RestAPI 호출
 * @param url URL
 * @param config 설정
 */
const $put = async (url: string, config?: ReqeustConfig) => {
  if (!config) {
    config = {};
  }
  setAttachConfig(config);
  config.url = url;
  config.method = 'PUT';
  return await call(config);
};

/**
 * DELETE RestAPI 호출
 * @param url URL
 * @param config 설정
 */
const $delete = async (url: string, config?: ReqeustConfig) => {
  if (!config) {
    config = {};
  }
  config.url = url;
  config.method = 'DELETE';
  return await call(config);
};

/**
 * 첨부파일 설정 적용
 */
const setAttachConfig = (config: ReqeustConfig) => {
  if (config.attach) {
    const formData = new FormData();
    Object.keys(config.data).forEach((dataKey) => {
      formData.append(dataKey, config.data[dataKey]);
    });
    config.data = formData;
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
};

/**
 * RestAPI 호출
 * @param config 설정
 */
const call = async (config: ReqeustConfig) => {
  const app = useNuxtApp();
  const { BACK_API_ABOUT_HOST, BACK_API_ABOUT_PORT } = useRuntimeConfig();
  if (!!app.ssrContext) {
    config.baseURL = `http://${BACK_API_ABOUT_HOST}:${BACK_API_ABOUT_PORT}`;
    config.headers = app.ssrContext.req.headers;
  }
  const { startLoading, stopLoading } = useLoading();
  if (!config.silence) {
    // 로딩 시작
    startLoading();
  }
  try {
    config = Object.assign(
      {},
      {
        method: 'GET',
        responseType: 'json',
        timeout: 3000,
        withCredentials: true,
      },
      config,
    );
    if (!app.ssrContext && process.env.NODE_ENV !== 'production') {
      console.info('API CALL', config);
    }
    const response = await axios(config);
    if (!config.silence) {
      // 로딩 종료
      stopLoading();
    }
    return response;
  } catch (error) {
    if (!app.ssrContext && process.env.NODE_ENV !== 'production') {
      console.error('ERROR: API CALL', error);
    }
    if (!config.silence) {
      const responseStatus = error.response?.status;
      let msg = error.response?.data?.msg || ''; // 오류 메세지
      if (!msg) {
        switch (responseStatus) {
          case 400:
            msg = '잘못된 입력입니다.';
            break;
          case 401:
          case 403:
            msg = '로그인이 필요한 기능입니다.';
            break;
          case 500:
            msg = '오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.';
            break;
          default:
            msg = '인터넷 연결이 불안정하거나 접속이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.';
            break;
        }
      }
      let title: string;
      let type: string = 'error';
      switch (responseStatus) {
        case 400:
          title = '호출 실패';
          break;
        case 401:
        case 403:
          title = '인증 정보 없음';
          type = 'warning';
          break;
        case 500:
          title = '서버 오류';
          break;
        default:
          title = '서버 응답 없음';
          break;
      }
      // 오류 메세지(msg) 출력
      if (!config.silence) {
        // 로딩 종료
        stopLoading();
      }
      useToast().clear();
      useToast().open({
        title,
        msg,
        type,
      });
    }
    return Promise.reject('cancel');
  }
};

/**
 * 공통 인자값
 */
export interface CommonParam {
  /**
   * 현재 페이지
   */
  page?: number;
  /**
   * 페이지당 항목수
   */
  size?: number;
  /**
   * 정렬값
   */
  sort?: string;
  /**
   * 전체 항목수
   */
  total?: number;
  /**
   * 검색 조건
   */
  conditions?: Array<SearchCondition>;
}

/**
 * 검색 조건 객체
 */
export interface SearchCondition {
  /**
   * 키
   */
  key: string;
  /**
   * 값
   */
  value?: any;
}

/**
 * CommonParam -> RequestConfig 변환
 *
 * @param commonParam 공통 인자값
 */
const parseRequestConfig = <ReqeustConfig>(commonParam: CommonParam = {}) => {
  const conditions = {};
  commonParam.conditions?.forEach((conditionItem) => {
    const value = conditionItem.value;
    if (value !== null && value !== undefined && value !== '') {
      conditions[conditionItem.key] = value;
    }
  });
  const params = {
    page: commonParam.page || 1,
    size: commonParam.size || 10,
    sort: commonParam.sort,
    conditions,
  };
  return {
    params,
  };
};

/**
 * CommonParam에 페이징 결과값 헤더에서 적재
 * @param commonParam
 * @param headers
 */
const setPagingResult = (commonParam: CommonParam = {}, headers: AxiosResponseHeaders) => {
  if (headers) {
    const page: string = headers['x-paging-page'];
    if (!isNaN(+page)) {
      commonParam.page = Number(page);
    }
    const size: string = headers['x-paging-size'];
    if (!isNaN(+size)) {
      commonParam.size = Number(size);
    }
    const sort: string = headers['x-paging-sort'];
    if (sort) {
      commonParam.sort = sort;
    }
    const total: string = headers['x-paging-total'];
    if (!isNaN(+total)) {
      commonParam.total = Number(total);
    }
  }
};

/**
 * Querystring에서 공통 인자값 가져오기
 */
const getCommonParamFromQuery = <CommonParam>(query: any = {}) => {
  if (typeof query.q === 'string') {
    return JSON.parse(decodeURIComponent(window.atob(query.q)));
  }
  return getDefaultParam();
};

/**
 * 공통 인자값에서 Querystring 넣기
 * @param commonParam 공통 인자값
 */
const setQueryFromCommonParam = (commonParam: CommonParam = {}) => {
  const q = window.btoa(encodeURIComponent(JSON.stringify(commonParam)));
  return {
    q,
  };
};

/**
 * 기본 공통 인자값 가져오기
 */
const getDefaultParam = <CommonParam>() => {
  return {
    page: 1, // 현재 페이지
    size: 10, // 항목당 페이지
    sort: null, // 정렬
    conditions: [], // 검색 조건 배열
  };
};

/**
 * 기본 조건 설정
 * @param commonParam 공통 인자값
 * @param conditions 조건 목록
 */
const setDefaultConditions = (commonParam: CommonParam, conditions: Array<SearchCondition>) => {
  conditions?.forEach((defaultCondition) => {
    let isExist = false;
    commonParam.conditions.some((condition) => {
      if (condition.key === defaultCondition.key) {
        condition.value = defaultCondition.value;
        isExist = true;
      }
      return isExist;
    });
    if (!isExist) {
      commonParam.conditions.push(defaultCondition);
    }
  });
};

export const useApi = () => ({
  $get,
  $post,
  $put,
  $delete,
  parseRequestConfig,
  setPagingResult,
  getCommonParamFromQuery,
  setQueryFromCommonParam,
  getDefaultParam,
  setDefaultConditions,
});
