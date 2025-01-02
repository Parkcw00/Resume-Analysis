import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

const usersRouter = express.Router();

// apiRouter.use('/users', usersRouter); 를 통하여 /users/me 에 경로로 들어오면 유저 조회가 진행됩니다.
usersRouter.get('/me', requireAccessToken, (req, res, next) => {
  try {
    // requireAccessToken에서 설정된 req.user값을 data에 할당합니다.
    const data = req.user;

    // 조회되었다는 상태코드와, 해당 유저를 조회했다는 메시지, 데이터를 반환합니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export { usersRouter };
