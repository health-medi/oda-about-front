export const useApplication = () => {
  /**
   * 어플리케이션 구동 여부
   */
  const isInit = useState<boolean>('application.isInit', () => false);

  return {
    isInit,
  };
};
