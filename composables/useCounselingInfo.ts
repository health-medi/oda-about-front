import { useApi, CommonParam } from "@/composables/useApi";

export const useCounselingInfo = () => {
  const { $post } = useApi();

  /**
   * 상담 신청 객체
   */
  class CounselingInfo {
    /**
     * 상담 신청 일련번호
     */
    counselingSeq?: number;
    /**
     * 병원 일련번호
     */
    hsptSeq: number;
    /**
     * 상담자명
     */
    usrNm: string;
    /**
     * 전화번호
     */
    phoneNo: string;
    /**
     * 상담유형
     */
    contactType: string;
    /**
     * 상태
     */
    status: string;
    /**
     * 메모
     */
    memo: string;
  }

  /**
   * 상담 신청 수정
   * @param counselingInfo  상담신청 객체
   * @returns
   */
  const createItem = async (counselingInfo: CounselingInfo) => {
    console.log(counselingInfo);
    const { data } = await $post(`/api/counseling-info`, {
      data: counselingInfo,
    });
    return Promise.resolve(data.isSuccess || false);
  };

  return {
    createItem,
  };
};
