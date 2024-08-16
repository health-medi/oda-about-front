import _ from 'lodash';

/**
 * 금액 포맷 (천 단위 콤마 찍기)
 * @param value 값
 */
export const currency = (value: number) => {
  if (value === undefined || value === null) {
    return value;
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 읽기 쉬운 파일 사이즈로 변경
 * @param value 파일크기 (Byte)
 * @param isHtml HTML 태그 적용 여부
 */
export const fileSize = (value: number, isHtml: boolean = false) => {
  if (_.isNumber(value) === false) {
    return '';
  }
  const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if (value <= 0) {
    let unit = isHtml ? `<small class="text-info-500">${s[0]}</span>` : s[0];
    return `${value} ${unit}`;
  }
  const e = Math.floor(Math.log(value) / Math.log(1024));
  const result = (value / Math.pow(1024, e)).toFixed(2);
  const unit = isHtml ? `<small class="text-info-500">${s[e]}</span>` : s[e];
  return `${result} ${unit}`;
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      numberUtils: () => ({
        currency,
        fileSize,
      }),
    },
  };
});
