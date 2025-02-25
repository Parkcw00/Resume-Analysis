import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import authController from '../controllers/auth.controller.js';

// authRouter를 선언하여 라우터로 사용합니다.
const authRouter = express.Router();

// authRouter의 post 매서드를 사용하여 sign-up경로에서 회원가입을 진행합니다.
authRouter.post('/sign-up', signUpValidator, authController.signUp);

// authRouter의 post 매서드를 사용하여 sign- in경로에서 로그인을 진행합니다.
authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    // req.body 값으로 email 과 비밀번호를 받습니다.
    const { email, password } = req.body;

    // email이 body 값과 중복되는 유저를 찾습니다.
    const user = await prisma.user.findUnique({ where: { email } });

    // 중복되는 유저와 그 유저의 암호를 복호화 합니다
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    // 만약 isPasswordMatched가 존재하지 않으면 유저가 없다는 뜻이 되므로 로그인이 진행되지 않고HTTP_STATUS.UNAUTHORIZED 인증되지 않은 유저라는 상태코드와 메시지로 응답합니다.
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.UNAUTHORIZED,
      });
    }

    // id는 user의 id 로 설정한다. 해당 값을 patLoad에 담습니다
    const payload = { id: user.id };

    // accessToken을 jwt를 사용하여 유저의 id를 ACCESS_TOKEN_SECRET을 사용하여 암호화 합니다
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // HTTP_STATUS.OK로 응답하고 로그인 성공 메시지를 보낸다. 그리고 data에 에세스 토큰을 담아 보냅니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

// authRouter를 export합니다.
export { authRouter };
