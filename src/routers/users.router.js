import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import userController from '../controllers/users.controller.js';

const usersRouter = express.Router();

// apiRouter.use('/users', usersRouter); 를 통하여 /users/me 에 경로로 들어오면 유저 조회가 진행됩니다.
usersRouter.get('/me', requireAccessToken, userController.getUser);

export { usersRouter };
