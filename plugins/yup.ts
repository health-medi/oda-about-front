import * as yup from 'yup';
import { josa } from '~~/plugins/utils/string.utils';
import { currency } from '~~/plugins/utils/number.utils';
import { MessageParams } from 'yup/lib/types';

// yup 한국어 설정
yup.setLocale({
  mixed: {
    default: (_ref) => `사용할 수 없는 값입니다.`,
    required: (_ref) => `필수 입력입니다.`,
    oneOf: (_ref) => `${_ref.values} 값 중 하나여야 합니다.`,
    notOneOf: (_ref) => `${_ref.values} 값 중 하나가 아니어야 합니다.`,
    notType: (_ref) => {
      const type = _ref.type;
      let msg: string;
      if (type == 'number') {
        msg = '숫자가 아닙니다.';
      } else if (type == 'date') {
        msg = '날짜 형식이 아닙니다.';
      } else if (type == 'time') {
        msg = '시간 형식이 아닙니다.';
      } else {
        msg = `올바른 형식이 아닙니다.`;
      }
      return msg;
    },
    defined: (_ref) => `정의되지 않았습니다.`,
  },
  number: {
    min: (_ref) => `${currency(_ref.min)} 이상이어야 합니다.`,
    max: (_ref) => `${currency(_ref.max)} 이하여야 합니다.`,
  },
  string: {
    length: (_ref) => `${_ref.length}자로 입력해 주세요.`,
    min: (_ref) => ` ${_ref.min}자 이상 입력해 주세요.`,
    max: (_ref) => `${_ref.max}자 까지 입력해 주세요.`,
    email: (_ref) => `이메일 형식이 아닙니다.`,
    matches: (_ref) => '형식에 맞지 않습니다.',
  },
});

const getLabel = (_ref: MessageParams): string => {
  return josa(_ref.label, '은');
};

/**
 * 시간 (HHmm) 정규식 정보
 */
export const TIME_REGEX = [/^([01][0-9]|2[0-3])([0-5][0-9])$/, '시:분 형식 필요'];

export default {};
