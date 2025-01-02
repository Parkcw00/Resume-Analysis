// express 웹 프레임워크를 임포트로 사용하여 서버구축을 시작합니다.
import express from 'express';
// 서버 포트정보를 /constants/env.constant.js경로에 저장하여 임포드로 불러옵니다. /constants/env.constant.js는 또 .env에서 port 정보를 받아옵니다.
import { SERVER_PORT } from './constants/env.constant.js';
// ./middlewares/error-handler.middleware.js'경로에서 설정한 에러핸들 미들웨어를 가져와서 app.use로 사용합니다. 만약 라우터에서 err가 발생하면 try,catch를 사용하여 에러핸들 미들웨어로 보내게 됩니다.
import { errorHandler } from './middlewares/error-handler.middleware.js';
// ./constants/http-status.constant.js에서 해당 http의 상태 코드에 대한 정보를 담고있고 그 정보를 가져와서 사용합니다.
import { HTTP_STATUS } from './constants/http-status.constant.js';
// ./routers/index.js' 경로 안에서 라우터를 설정하여 그 값을 가져오고 app.use에서 /api 경로에 들어가면 해당 라우터들을 사용하게 됩니다.
import { apiRouter } from './routers/index.js';

// app을 선언하고 express를 사용한다 라는 값을 할당합니다.
const app = express();

// app을 사용하게 되면 해당 정보들을 보낼 때 json 파일로 변환하여 보내줍니다.
app.use(express.json());
// extended 속성의 값으로 true를 입력하게 되면 qs 모듈을 사용하여 쿼리스트링을 해석합니다. qs 모듈이란 URL 쿼리 문자열을 자바스크립트 객체 형태로 변환하거나, 객체를 URL 쿼리 문자열로 변환하는 기능입니다.
app.use(express.urlencoded({ extended: true }));

// /health-check 경로로 들어가서 get http 매서드를 사용하여 HTTP_STATUS.OK=200 코드와 `I'm healthy.`라는 문자열을 응답합니다.
app.get('/health-check', (req, res) => {
  return res.status(HTTP_STATUS.OK).send(`I'm healthy.`);
});

// /api 경로로 들어가면 apiRouter를 사용할 수 있게 됩니다.
app.use('/api', apiRouter);

// 만약 apiRouter를 사용할때 오류가 발생하면 next를 통해 요청이 errorHandler로 패스됩니다.
app.use(errorHandler);

// 서버를 SERVER_PORT값으로 실행합니다
app.listen(SERVER_PORT, () => {
  console.log(`서버가 ${SERVER_PORT}번 포트에서 실행 중입니다.`);
});
