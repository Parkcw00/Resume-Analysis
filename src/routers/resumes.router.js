import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';

// resumesRouter이력서와 관련된 라우터를 사용하기 위해 선언합니다.
const resumesRouter = express.Router();

// 이력서 생성 - /resumes 경로에서 post 매서드를 사용하여 이력서를 생성합니다.
resumesRouter.post('/', createResumeValidator, async (req, res, next) => {
  try {
    // index.js파일의 apiRouter.use('/resumes', requireAccessToken, resumesRouter);에서 requireAccessToken안에 토큰을 발급받은 사람의 정보를 req.user에 담습니다.
    const user = req.user;
    // body 값으로 입력한 타이틀과 컨탠트를 받아옵니다.
    const { title, content } = req.body;
    // user의 id
    const authorId = user.id;

    // resume 이력서 테이블에 해당 정보들을 입력합니다.
    const data = await prisma.resume.create({
      data: {
        authorId,
        title,
        content,
      },
    });

    // 완성되었다는 상태코드와 메시지, 데이터를 응답합ㄴ디ㅏ.
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 목록 조회 /resumes 경로에서 get 매서드를 사용하여 이력서를 조회합니다.
resumesRouter.get('/', async (req, res, next) => {
  try {
    // index.js파일의 apiRouter.use('/resumes', requireAccessToken, resumesRouter);에서 requireAccessToken안에 토큰을 발급받은 사람의 정보를 req.user에 담습니다.
    const user = req.user;
    // user의 id
    const authorId = user.id;

    // url 쿼리에 닶긴 값을 구조분해 할당으로 가져옵니다.
    let { sort } = req.query;

    // sort가 존재하면 소문자로 변환합니다.
    sort = sort?.toLowerCase();

    // 만약 sort값이 내림차순이 아니거나 오름차순이 아닌 경우 내림차순으로 만듭니다.
    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    // 이력서 페이지에 존재하는 본인의 이력서들을 찾습니다.
    let data = await prisma.resume.findMany({
      where: { authorId },
      orderBy: {
        createdAt: sort,
      },
      include: {
        author: true,
      },
    });

    // 가져온 데이터 배열을 새롭게 배열하여 만듭니다. id 값은 이력서의 아이디, 인증자 이름은 이력서의 인증자이름 등 보여줄 데이터를 새롭게 설정합니다.
    data = data.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });

    // 응답 완료되었다는 코드와 함께 상태코드와 메시지, 데이터를 반환합니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회 /resumes 경로에서 get 매서드를 사용하여 이력서를 상세하게 조회합니다.
resumesRouter.get('/:id', async (req, res, next) => {
  try {
    // index.js파일의 apiRouter.use('/resumes', requireAccessToken, resumesRouter);에서 requireAccessToken안에 토큰을 발급받은 사람의 정보를 req.user에 담습니다.
    const user = req.user;
    // user의 id
    const authorId = user.id;
    // 파라미터에 있는 id 값을 가져옵니다
    const { id } = req.params;

    // 만약 가져온 id 값이 로그인 된 id 값과 같고 인증이 true인 경우 그 이력서 값을 data에 할당합니다.
    let data = await prisma.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: true },
    });

    // 만약 해당 데이터가 존재하지 않는다면 존재하지 않다는 상태코드와 이력서를 찾을 수 없다는 메시지를 반환합니다.
    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 받은 데이터를 보기 쉽게 가공합니다. 
    data = {
      id: data.id,
      authorName: data.author.name,
      title: data.title,
      content: data.content,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    // 조회 되었다는 응답코드와 상세이력서 조회를 했다는 메시지, 데이터를 반환합니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 수정 /resumes/:id 경로에서 put 매서드를 사용하여 이력서를 수정합니다.
resumesRouter.put('/:id', updateResumeValidator, async (req, res, next) => {
  try {
    // index.js파일의 apiRouter.use('/resumes', requireAccessToken, resumesRouter);에서 requireAccessToken안에 토큰을 발급받은 사람의 정보를 req.user에 담습니다.
    const user = req.user;
    // user의 id
    const authorId = user.id;
    // 파라미터에 있는 id 값을 가져옵니다
    const { id } = req.params;
    // body 값으로 수정할 타이틀과 컨탠츠 값을 가져옵니다.
    const { title, content } = req.body;

    // 만약 가져온 id 값이 로그인 된 id 값과 같으면 그 이력서 값을 existedResume에 할당합니다.
    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    // existedResume 값이 존재하지 않는다면 존재하지 않다는 상태코드와 이력서를 찾을 수 없다는 메시지를 반환합니다.
    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 존재한다면 이력서 테이블에 있는 정보를 업데이트 하여 data에 할당합니다.
    const data = await prisma.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    // 수정이 성공적으로 되었다는 응답 코드와 메시지, 데이터를 반환합니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제 /resumes 경로에서 get 매서드를 사용하여 이력서를 상세하게 조회합니다.
resumesRouter.delete('/:id', async (req, res, next) => {
  try {
    // index.js파일의 apiRouter.use('/resumes', requireAccessToken, resumesRouter);에서 requireAccessToken안에 토큰을 발급받은 사람의 정보를 req.user에 담습니다.
    const user = req.user;
    // user의 id
    const authorId = user.id;
    // 파라미터에 있는 id 값을 가져옵니다
    const { id } = req.params;

    // 가져온 id 값이 로그인 된 id 값과 인증된 id으로 같으면 그 이력서 값을 existedResume에 할당합니다.
    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    // existedResume 값이 존재하지 않는다면 존재하지 않다는 상태코드와 이력서를 찾을 수 없다는 메시지를 반환합니다.
    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 존재한다면 해당 id 값과 같은 이력서를 삭제합니다.
    const data = await prisma.resume.delete({ where: { id: +id, authorId } });

    //  성공적으로 진행되었다는 응답 코드와 삭제 메시지, 데이터를 반환합니다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: { id: data.id },
    });
  } catch (error) {
    next(error);
  }
});

export { resumesRouter };
