/**
 * 쿠키 넣기
 * @param name 이름
 * @param value 값
 * @param expireDay 만료일
 * @param path 경로
 * @param domain 도메인
 * @param secure secure 여부
 */
export const setCookie = (
  name: string,
  value: any,
  expireDay: number = 1,
  path: string = null,
  domain: string = null,
  secure: boolean = null,
) => {
  const today = new Date();
  today.setTime(today.getTime());
  const expires = new Date(today.getTime() + (expireDay > 0 ? expireDay * 1000 * 60 * 60 * 24 : 0));
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    (expireDay ? ';expires=' + expires.toUTCString() : '') +
    (path ? ';path=' + path : '') +
    (domain ? ';domain=' + domain : '') +
    (secure ? ';secure' : '');
};

/**
 * 쿠키 가져오기
 * @param name 이름
 */
export const getCookie = (name: string) => {
  let a_all_cookies = document.cookie.split(';');
  let a_temp_cookie = null;
  let cookie_name = '';
  let cookie_value = '';
  let b_cookie_found = false;
  for (let i = 0; i < a_all_cookies.length; i++) {
    a_temp_cookie = a_all_cookies[i].split('=');
    cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
    if (cookie_name === name) {
      b_cookie_found = true;
      if (a_temp_cookie.length > 1) {
        cookie_value = decodeURIComponent(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
      }
      return cookie_value;
    }
    a_temp_cookie = null;
    cookie_name = '';
  }
  if (!b_cookie_found) {
    return null;
  }
};

/**
 * 쿠키 삭제하기
 * @param name 이름
 * @param path 경로
 * @param domain 도메인
 */
export const deleteCookie = (name: string, path: string = null, domain: string = null) => {
  if (getCookie(name)) {
    document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
  }
};
