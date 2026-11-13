# Smoking Spot — Server

Express + MongoDB(Mongoose) API, Vercel 서버리스로 배포합니다. 전체 배포 가이드는 [client README](https://github.com/seongjooon/smoking-spot-client#readme) 참고.

- 인증: `Authorization: Bearer <Firebase ID token>` 을 서버가 검증 (`FIREBASE_PROJECT_ID` 필요)
- 이미지: `POST /spots/upload` 가 Vercel Blob 클라이언트 업로드 토큰을 발급 (인증 필수, 이미지 10MB 이하)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/health` | 상태 확인 |
| POST | `/users` | 로그인한 사용자 등록 |
| GET | `/spots` / `/spots/:id` | 목록 / 상세 |
| POST | `/spots/new` | 장소 등록 |
| GET, POST | `/coments/:spot_id` | 댓글 조회 / 등록 |

환경변수는 `.env.example` 참고. `npm run dev` 로 로컬 실행, `npm test` 로 테스트.
