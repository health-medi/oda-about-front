/**
 * 제한값(limit)보다 문자열이 크면 말줄임(...) 처리
 */
export const limit = (value: string, limit: number): string => {
  if (!value || value.length < limit) {
    return value;
  }
  return `${value.substring(0, limit)}…`;
};

/**
 * 조사 알맞게 삽입
 */
export const josa = (value: string, josa: string): string => {
  const code = value.charCodeAt(value.length - 1) - 44032;

  // 원본 문구가 없을때는 빈 문자열 반환
  if (value.length == 0) return '';

  // 한글이 아닐때
  if (code < 0 || code > 11171) return value;

  // jong : true면 받침있음, false면 받침없음
  const jong = code % 28 !== 0;
  let suffix = '';
  if (josa == '을' || josa == '를') {
    suffix = jong ? '을' : '를';
  } else if (josa == '이' || josa == '가') {
    suffix = jong ? '이' : '가';
  } else if (josa == '은' || josa == '는') {
    suffix = jong ? '은' : '는';
  } else if (josa == '와' || josa == '과') {
    suffix = jong ? '와' : '과';
  }

  return value + suffix;
};

/**
 * 문자열 바이트 체크
 */
export const byte = (value: string): number => {
  return value
    .split('')
    .map((s) => s.charCodeAt(0))
    .reduce((prev, c) => prev + (c >> 11 ? 3 : c >> 7 ? 2 : 1), 0);
};

/**
 * UUID 생성
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 문자열의 앞글자를 대문자로 변환
 *
 * @param value 변경할 문자열
 * @return 변경된 문자열
 */
export const capitalize = (value: string): string => {
  return value.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

/**
 * 입력받은 휴대폰번호에 하이픈(-) 넣기
 *
 * @param phoneNo 휴대폰번호
 * @return 하이픈이 들어간 휴대폰번호
 */
export const phoneHumanCase = (phoneNo: string): string => {
  return phoneNo.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      stringUtils: () => ({
        limit,
        josa,
        byte,
        uuid,
        capitalize,
      }),
    },
  };
});
