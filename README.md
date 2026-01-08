# 초등학생 수학 학습 웹앱

2022 개정 교육과정을 반영한 초등학생을 위한 맞춤형 수학 학습 플랫폼입니다.

## ⚠️ 배포 안내

이 프로젝트는 **풀스택 애플리케이션**입니다. 완전한 기능을 사용하려면:

1. **백엔드 배포 필요**: Railway, Render 등에 백엔드 배포
2. **프론트엔드 배포**: Vercel (현재 배포됨)
3. **환경 변수 설정**: Vercel의 `VITE_API_URL`을 백엔드 URL로 설정

### 빠른 배포
- 백엔드: [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md) 참조
- 전체 가이드: [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

---

## 주요 기능

### 1. 학년별/단원별 학습
- 1-6학년 전 학년 교육과정 지원
- 4대 영역별 체계적 학습 (수와 연산, 변화와 관계, 도형과 측정, 자료와 가능성)
- 학기별, 단원별 선택 학습 가능

### 2. 개념 학습
- 각 단원의 핵심 개념 설명
- 예제 문제와 풀이 과정 제공
- 시각 자료를 통한 이해 증진

### 3. 문제 풀이
- 난이도별 문제 제공 (1-5단계)
- 객관식, 단답형, 서술형 다양한 문제 유형
- 실시간 자동 채점
- 단계별 풀이 과정 추적

### 4. 오답노트
- 틀린 문제 자동 수집
- 어느 단계에서 틀렸는지 정확한 분석
- 올바른 풀이 과정 제공
- 복습 관리 및 마스터 체크

### 5. 성취도 분석
- 단원별 정확도 통계
- 취약 개념 자동 식별
- 학습 시간 및 진도율 추적
- 맞춤형 보충 학습 추천

### 6. 적응형 학습
- 학생의 취약점 기반 문제 추천
- 목표 점수 설정 및 달성도 관리
- 개인 맞춤 학습 경로 제공

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite (빌드 도구)
- React Router (라우팅)
- Tailwind CSS (스타일링)
- Zustand (상태 관리)
- Axios (HTTP 클라이언트)

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (데이터베이스)
- Prisma ORM
- JWT (인증)
- bcryptjs (암호화)

## 시작하기

### 필수 요구사항
- Node.js 18+
- PostgreSQL 14+
- npm 또는 yarn

### 설치 방법

1. 저장소 클론
\`\`\`bash
cd elementary-math-app
\`\`\`

2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

3. 환경 변수 설정

Backend `.env` 파일 생성:
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

`.env` 파일 편집:
\`\`\`
DATABASE_URL="postgresql://username:password@localhost:5432/elementary_math?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
\`\`\`

4. 데이터베이스 설정
\`\`\`bash
cd backend
npm run prisma:migrate
npm run prisma:seed
\`\`\`

5. 개발 서버 실행

루트 디렉토리에서:
\`\`\`bash
npm run dev
\`\`\`

또는 개별 실행:
\`\`\`bash
# Backend (터미널 1)
cd backend
npm run dev

# Frontend (터미널 2)
cd frontend
npm run dev
\`\`\`

6. 브라우저에서 접속
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 데이터베이스 스키마

주요 테이블:
- `users` - 학생 정보
- `units` - 학습 단원
- `concepts` - 개념
- `problems` - 문제
- `problem_attempts` - 문제 풀이 기록
- `wrong_answer_notes` - 오답노트
- `achievements` - 성취도
- `goals` - 학습 목표
- `learning_records` - 학습 기록

상세 스키마는 `backend/prisma/schema.prisma` 참조

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 단원
- `GET /api/units` - 단원 목록 조회
- `GET /api/units/:id` - 단원 상세 조회
- `GET /api/units/:id/progress` - 단원 진도 조회

### 개념
- `GET /api/concepts/:id` - 개념 조회
- `GET /api/concepts/unit/:unitId` - 단원별 개념 목록

### 문제
- `GET /api/problems` - 문제 조회
- `GET /api/problems/:id` - 문제 상세
- `POST /api/problems/:id/submit` - 문제 제출
- `GET /api/problems/recommend/:unitId` - 추천 문제

### 학습
- `POST /api/learning/start` - 학습 시작
- `POST /api/learning/complete` - 학습 완료
- `GET /api/learning/history` - 학습 기록
- `GET /api/learning/wrong-answers` - 오답노트 조회
- `PATCH /api/learning/wrong-answers/:id/review` - 오답 복습

### 성취도
- `GET /api/achievements` - 전체 성취도
- `GET /api/achievements/unit/:unitId` - 단원 성취도
- `GET /api/achievements/stats` - 학습 통계

### 목표
- `POST /api/goals` - 목표 생성
- `GET /api/goals` - 목표 목록
- `PATCH /api/goals/:id/progress` - 목표 진척도 업데이트
- `DELETE /api/goals/:id` - 목표 삭제

## 배포

### Frontend 배포 (Vercel)

1. Vercel 계정 생성 및 로그인
2. GitHub 저장소 연결
3. 프로젝트 설정:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. 환경 변수 설정:
   - `VITE_API_URL`: 백엔드 API URL

### Backend 배포 (Railway)

1. Railway 계정 생성 및 로그인
2. New Project 클릭
3. Deploy from GitHub repo 선택
4. 환경 변수 설정:
   - `DATABASE_URL`: PostgreSQL 연결 문자열
   - `JWT_SECRET`: JWT 시크릿 키
   - `NODE_ENV`: production
5. PostgreSQL 플러그인 추가
6. 배포 후 데이터베이스 마이그레이션 실행:
\`\`\`bash
railway run npm run prisma:migrate
railway run npm run prisma:seed
\`\`\`

### 대체 배포 옵션

**Frontend**
- Netlify
- GitHub Pages
- AWS Amplify

**Backend**
- Render
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform

**Database**
- Supabase (PostgreSQL)
- Neon (PostgreSQL)
- Railway PostgreSQL
- AWS RDS

## 향후 개발 계획

### 추가 기능
1. **AI 튜터 기능**
   - 자연어로 질문하고 답변 받기
   - 개념 이해도 평가 및 설명

2. **학부모 대시보드**
   - 자녀의 학습 현황 모니터링
   - 학습 리포트 생성

3. **게임화 요소**
   - 배지 및 업적 시스템
   - 학습 스트릭
   - 리더보드

4. **소셜 기능**
   - 친구와 함께 학습
   - 학습 그룹 형성
   - 문제 공유

5. **오프라인 모드**
   - PWA 지원
   - 오프라인 문제 풀이

### 개선 사항
- 더 많은 문제 추가 (각 단원별 100+ 문제)
- 상세한 해설 및 풀이 동영상
- 음성 인식을 통한 답안 입력
- 접근성 개선 (스크린 리더 지원)
- 다크 모드 지원

## 문제 수집 및 검증

### 문제 출처
- 한국교육과정평가원 자료
- 교육부 인정 교과서
- 각 시도교육청 자료
- 기출문제 및 평가 문항

### 검증 프로세스
1. 자동 검증: 정답 일치 확인
2. 교차 검증: 다른 출처와 비교
3. 전문가 검토: 교사 및 교육 전문가 리뷰
4. 사용자 피드백: 오류 신고 시스템

## 라이선스

MIT License

## 기여

버그 리포트, 기능 제안, PR 환영합니다!

## 문의

프로젝트 관련 문의사항은 GitHub Issues를 이용해 주세요.
