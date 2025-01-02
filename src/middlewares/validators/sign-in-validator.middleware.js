// 조이 라이브러리를 사용합니다.
import Joi from 'joi';
// ../../constants/message.constant.js에 선언되어 있는 메시지 값을 가져와서 사용합니다.
import { MESSAGES } from '../../constants/message.constant.js';

//조이 라이브러리를 사용해서 email과 password 부분의 유효성 검사를 진행합니다.
const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
  }),
  password: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
  }),
});

// 로그인 유효성 검사 함수로 지정합니다. 
export const signInValidator = async (req, res, next) => {
  try {
    //조이 라이브러리로 만든 스키마 유효성 감사를 req.body 값으로 받는 부분을 확인합니다
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
