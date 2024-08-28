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
 * 글자 제한
 */
export const limitString = (value: string, limit: number): string => {
  if (!value || value.length < limit) {
    return value;
  }
  return `${value.substring(0, limit)}`;
};

/**
 * 조사 알맞게 삽입
 */
export const josa = (value: string, josa: string): string => {
  const code = value.charCodeAt(value.length - 1) - 44032;

  // 원본 문구가 없을때는 빈 문자열 반환
  if (value.length == 0) return "";

  // 한글이 아닐때
  if (code < 0 || code > 11171) return value;

  // jong : true면 받침있음, false면 받침없음
  const jong = code % 28 !== 0;
  let suffix = "";
  if (josa == "을" || josa == "를") {
    suffix = jong ? "을" : "를";
  } else if (josa == "이" || josa == "가") {
    suffix = jong ? "이" : "가";
  } else if (josa == "은" || josa == "는") {
    suffix = jong ? "은" : "는";
  } else if (josa == "와" || josa == "과") {
    suffix = jong ? "와" : "과";
  }

  return value + suffix;
};

/**
 * 문자열 바이트 체크
 */
export const byte = (value: string): number => {
  return value
    .split("")
    .map((s) => s.charCodeAt(0))
    .reduce((prev, c) => prev + (c >> 11 ? 3 : c >> 7 ? 2 : 1), 0);
};

/**
 * UUID 생성
 */
export const uuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 전화번호 포맷으로 변경
 * @param value
 * @param isMasking 가운데 마스킹 여부
 */
export const phone = (value: string, isMasking: boolean) => {
  let phoneStr = "";

  // 입력 값 검증
  if (!/^\d+$/.test(value)) {
    return value; // 입력값이 숫자가 아니면 그대로 반환
  }

  try {
    if (value.length == 11) {
      // 11자리 휴대전화 번호 처리
      phoneStr = value.replace(
        /(\d{3})(\d{4})(\d{4})/,
        isMasking ? "$1-****-$3" : "$1-$2-$3"
      );
    } else if (value.length == 8) {
      // 8자리 전화번호 처리 (일반적으로 구내 번호)
      phoneStr = value.replace(/(\d{4})(\d{4})/, "$1-$2");
    } else if (value.length == 9 && value.indexOf("02") == 0) {
      // 9자리 서울 지역번호 처리 (예: 02-000-0000)
      phoneStr = value.replace(
        /(\d{2})(\d{3})(\d{4})/,
        isMasking ? "$1-***-$3" : "$1-$2-$3"
      );
    } else if (value.length == 10 && value.indexOf("02") == 0) {
      // 10자리 서울 지역번호 처리 (예: 02-0000-0000)
      phoneStr = value.replace(
        /(\d{2})(\d{4})(\d{4})/,
        isMasking ? "$1-****-$3" : "$1-$2-$3"
      );
    } else {
      // 기타 지역번호 처리 (예: 031-123-4567)
      phoneStr = value.replace(
        /(\d{3})(\d{3})(\d{4})/,
        isMasking ? "$1-***-$3" : "$1-$2-$3"
      );
    }
  } catch (error) {
    console.error("Phone number formatting error:", error);
    phoneStr = value;
  }

  return phoneStr;
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
  return phoneNo.replace(
    /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
    "$1-$2-$3"
  );
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      stringUtils: () => ({
        limit,
        limitString,
        josa,
        byte,
        uuid,
        phone,
        capitalize,
        phoneHumanCase,
      }),
    },
  };
});
