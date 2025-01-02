import express from 'express';
import { authRouter } from './auth.router.js';
import { usersRouter } from './users.router.js';
import { resumesRouter } from './resumes.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const apiRouter = express.Router();

// /auth로 들어오면 authRouter를 사용할 수 있습니다. 
apiRouter.use('/auth', authRouter);
// /users로 들어오면 usersRouter 사용할 수 있습니다. 
apiRouter.use('/users', usersRouter);
// /resumes로 들어오면 requireAccessToken미들웨어를 거쳐서 resumesRouter 사용할 수 있습니다. 
apiRouter.use('/resumes', requireAccessToken, resumesRouter);

export { apiRouter };
