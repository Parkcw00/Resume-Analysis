import express from 'express';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';
import AuthController from '../controllers/resumes.controller.js';

// resumesRouter이력서와 관련된 라우터를 사용하기 위해 선언합니다.
const resumesRouter = express.Router();

// 이력서 생성 - /resumes 경로에서 post 매서드를 사용하여 이력서를 생성합니다.
resumesRouter.post('/', createResumeValidator, AuthController.createResume);

// 이력서 목록 조회 /resumes 경로에서 get 매서드를 사용하여 이력서를 조회합니다.
resumesRouter.get('/', AuthController.getResume);

// 이력서 상세 조회 /resumes 경로에서 get 매서드를 사용하여 이력서를 상세하게 조회합니다.
resumesRouter.get('/', AuthController.getDetailResume);

// 이력서 수정 /resumes/:id 경로에서 put 매서드를 사용하여 이력서를 수정합니다.
resumesRouter.put('/:id', updateResumeValidator, AuthController.putResume);

// 이력서 삭제 /resumes 경로에서 get 매서드를 사용하여 이력서를 상세하게 조회합니다.
resumesRouter.delete('/:id', AuthController.deleteResume);

export { resumesRouter };
