// .emv 파일에 정의된 환경 변수를 자동으로 로드합니다.
import 'dotenv/config';
// 서버 포트 값을 .env 파일에 저정하여 가져옵니다
export const SERVER_PORT = process.env.SERVER_PORT;
// 에세스 토큰 스크릿 키를 .eve 파일에 저장된 값으로 가져옵니다.
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
