import { useApi, CommonParam } from '@/composables/useApi';

export const useHospital = () => {
  const { $get, $post, $put, $delete, parseRequestConfig, setPagingResult } = useApi();

  /**
   * 병원 객체
   */
  class Hospital {
    /**
     * 병원 일련번호
     */
    hsptSeq?: number;
    /**
     * 병원명
     */
    hsptNm: string;
    /**
     * 상점 아이디 MID
     */
    mid: string;
    /**
     * 진료과목
     */
    medicalSubject: string;
    /**
     * 전문진료과목
     */
    specialMedicalSubject?: string;
    /**
     * 공휴일
     */
    holiday: string;
    /**
     * 진료특이사항
     */
    diagnosisEtc?: string;
    /**
     * 병원특장점
     */
    hsptMarketing?: string;
    /**
     * 병원소개
     */
    hsptIntro?: string;
    /**
     * 상담전화번호
     */
    counselingPhoneNo: string;
    /**
     * 노출 설정 여부
     */
    displayYn: string;
    /**
     * X좌표
     */
    locXPos: string;
    /**
     * Y좌표
     */
    locYPos: string;
  }

  /**
   * 병원 목록 조회
   *
   * @param commonParam 공통 인자값
   */
  const fetchList = async (commonParam: CommonParam) => {
    const { data, headers } = await $get('/api/hospital', parseRequestConfig(commonParam));
    setPagingResult(commonParam, headers);
    return Promise.resolve({ data, commonParam });
  };

  /**
   * 병원 상세 조회
   *
   * @param hsptSeq 병원 일련번호
   */
  const fetchItem = async (hsptSeq: number) => {
    const { data } = await $get(`/api/hospital/${hsptSeq}`);
    return Promise.resolve({ data });
  };

  /**
   * 병원 등록
   *
   * @param hospital 병원 객체
   */
  const createItem = async (hospital: Hospital) => {
    const { data } = await $post('/api/hospital', {
      data: hospital,
    });
    return Promise.resolve({ data });
  };

  /**
   * 병원 수정
   *
   * @param hsptSeq 병원 객체
   */
  const modifyItem = async (hospital: Hospital) => {
    const { data } = await $put(`/api/hospital/${hospital.hsptSeq}`, {
      data: hospital,
    });
    return Promise.resolve({ data });
  };

  /**
   * 병원 삭제
   *
   * @param hsptSeq 병원 일련번호
   */
  const removeItem = async (hsptSeq: number) => {
    const { data } = await $delete(`/api/hospital/${hsptSeq}`);
    return Promise.resolve({ data });
  };

  return {
    fetchList,
    fetchItem,
    createItem,
    modifyItem,
    removeItem,
  };
};
