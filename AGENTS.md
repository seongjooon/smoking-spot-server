# AGENTS.md — smoking-spot-server

흡연구역 지도 웹앱의 API 서버. 클라이언트: https://github.com/seongjooon/smoking-spot-client

## 스택
Node 20+ · Express 4 · Mongoose · firebase-admin(ID 토큰 검증) · `@vercel/blob`(업로드 토큰 발급) · helmet · express-rate-limit · `node:test`

Vercel 서버리스로 배포한다: `api/index.js` 가 Express 앱(`app.js`)을 export 하고 `vercel.json` 이 모든 경로를 `/api` 로 리라이트한다. 로컬은 `bin/www`.

## 명령
```bash
npm install
npm run dev     # nodemon, http://localhost:5000 (.env 필요)
npm test        # node --test test/*.test.js (7개)
```
CI(`.github/workflows/ci.yml`)가 `npm ci`, `npm test` 를 실행한다.

## API
| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/health` | 없음 | DB 없이 응답 |
| POST | `/users` | Bearer | 로그인한 사용자 upsert |
| GET | `/spots`, `/spots/:id` | Bearer | 목록 / 상세 |
| POST | `/spots/new` | Bearer | 장소 등록 |
| POST | `/spots/upload` | Bearer | Vercel Blob 클라이언트 업로드 토큰 (이미지, 10MB) |
| GET/POST | `/coments/:spot_id` | Bearer | 댓글 조회 / 등록 (평점 0~5) |

인증은 `Authorization: Bearer <Firebase ID token>` → `middlewares/auth.js` 가 검증해 `req.user` 를 채운다.

## 구조
`app.js`(미들웨어, DB 연결 보장, 에러 핸들러) · `lib/db.js`(서버리스용 연결 캐시) · `lib/firebase.js` · `middlewares/auth.js` · `models/` · `routes/index.js` · `routes/controllers/`

## 환경변수 (`.env.example`)
`DATABASE_URL`, `FIREBASE_PROJECT_ID`, `CLIENT_URL`(쉼표로 여러 개, CORS 허용 목록), `BLOB_READ_WRITE_TOKEN`(Vercel Blob 연결 시 자동 주입)

## 규칙 / 주의
- 작성자(`Spot.email`, `Coment.created_by`)는 항상 `req.user` 에서 가져온다. 요청 body 값을 신뢰하지 말 것.
- 입력 검증은 Mongoose `validate()` 로 하고 실패 시 400. 컨트롤러에서 에러는 `next(err)` 로 넘기고, `next()` 뒤에 응답을 또 보내지 말 것.
- 서버리스이므로 모듈 전역 상태나 장기 연결에 기대지 말 것(DB 연결은 `lib/db.js` 캐시만).
- 테스트는 Firebase/DB 를 스텁한다(`test/api.test.js`). 이 환경에서는 MongoDB 바이너리를 받을 수 없어 실제 DB 통합 테스트는 못 했다.
- 브랜치: 기준은 `seongjoon` (`master` 없음). 병합은 사용자 요청이 있을 때만.

## 아직 검증되지 않은 것
실제 MongoDB Atlas / Firebase / Vercel Blob 연동과 Vercel 런타임 동작은 실제 환경에서 실행해 보지 못했다. 배포 후 `/health` 와 로그인·등록 흐름으로 확인해야 한다.

## 기타
GitHub 가 기본 브랜치에 Dependabot 경고(2019년 의존성 기준)를 표시했다. 개편 병합 후 재확인 필요.
