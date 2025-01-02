// 조이 라이브러리를 사용합니다.
import Joi from 'joi';
// ../../constants/message.constant.js에 선언되어 있는 메시지 값을 가져와서 사용합니다.
import { MESSAGES } from '../../constants/message.constant.js';
// ../../constants/auth.constant.js에 선언되어 있는 패스워드의 최소 길이 값을 가져옵니다.
import { MIN_PASSWORD_LENGTH } from '../../constants/auth.constant.js';

//조이 라이브러리를 사용해서 email과 password, passwordConfirm,  name부분의 유효성 검사를 진행합니다.
const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
  }),
  password: Joi.string().required().min(MIN_PASSWORD_LENGTH).messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
    'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQURIED,
    'any.only': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MACHTED_WITH_PASSWORD,
  }),
  name: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.NAME.REQURIED,
  }),
});

// 회원가입 유효성 검사 함수로 지정합니다. 
export const signUpValidator = async (req, res, next) => {
  try {
    //조이 라이브러리로 만든 스키마 유효성 감사를 req.body 값으로 받는 부분을 확인합니다
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
