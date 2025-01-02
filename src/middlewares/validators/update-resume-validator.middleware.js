// 조이 라이브러리를 사용합니다.
import Joi from 'joi';
// ../../constants/message.constant.js에 선언되어 있는 메시지 값을 가져와서 사용합니다.
import { MESSAGES } from '../../constants/message.constant.js';
// 이력서 최소 길이를 ./resume.constant.js'에서 값을 가져옵니다.
import { MIN_RESUME_LENGTH } from '../../constants/resume.constant.js';

//조이 라이브러리를 사용해서 타이틀과 컨탠츠 부분의 유효성 검사를 진행합니다.
const schema = Joi.object({
  title: Joi.string(),
  content: Joi.string().min(MIN_RESUME_LENGTH).messages({
    'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
  }),
})
  .min(1)
  .messages({
    'object.min': MESSAGES.RESUMES.UPDATE.NO_BODY_DATA,
  });


  // 이력서 수정 유효성 검사 함수로 지정합니다. 
export const updateResumeValidator = async (req, res, next) => {
  try {
    //조이 라이브러리로 만든 스키마 유효성 감사를 req.body 값으로 받는 부분을 확인합니다
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
