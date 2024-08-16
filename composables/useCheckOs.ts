export const useCheckOs = () => {
  const osStatus = useState('osStatus', () => '');

  const checkMobile = () => {
    const mobileType = navigator.userAgent.toLowerCase();
    if (mobileType.indexOf('android') > -1) {
      return window.open('https://play.google.com/store/apps/details?id=net.bbeu.app');
    } else if (
      mobileType.indexOf('iphone') > -1 ||
      mobileType.indexOf('ipad') > -1 ||
      mobileType.indexOf('ipod') > -1 ||
      mobileType.indexOf('mac') > -1
    ) {
      window.open('https://apps.apple.com/app/id1443705149');
    } else {
    }
  };

  return { checkMobile, osStatus };
};
