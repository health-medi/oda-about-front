export const useCheckOs = () => {
  const osStatus = useState("osStatus", () => "");

  const checkMobile = () => {
    const mobileType = navigator.userAgent.toLowerCase();
    if (mobileType.indexOf("android") > -1) {
      return window.open(
        "https://play.google.com/store/apps/details?id=kr.oda.flutter.app&pcampaignid=web_share"
      );
    } else if (
      mobileType.indexOf("iphone") > -1 ||
      mobileType.indexOf("ipad") > -1 ||
      mobileType.indexOf("ipod") > -1 ||
      mobileType.indexOf("mac") > -1
    ) {
      window.open(
        "https://apps.apple.com/kr/app/%EC%98%A4%EB%8B%A4-%EC%98%A4%EB%8A%98%EC%9D%98%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8-%ED%95%9C%EC%9D%98%EC%82%AC-1-1-%EC%BC%80%EC%96%B4-%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8%EC%9D%BC%EA%B8%B0/id1637382274"
      );
    } else {
    }
  };

  return { checkMobile, osStatus };
};
