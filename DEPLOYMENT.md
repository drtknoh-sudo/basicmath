# 배포 가이드

이 문서는 초등 수학 학습 웹앱을 프로덕션 환경에 배포하는 방법을 설명합니다.

## 배포 전 체크리스트

- [ ] 모든 환경 변수 설정 완료
- [ ] 데이터베이스 백업 완료
- [ ] 프로덕션 빌드 테스트 완료
- [ ] API 엔드포인트 확인
- [ ] CORS 설정 확인
- [ ] SSL/TLS 인증서 준비

## 방법 1: Railway를 이용한 풀스택 배포 (추천)

Railway는 풀스택 애플리케이션을 쉽게 배포할 수 있는 플랫폼입니다.

### 1. Railway 계정 생성
1. https://railway.app 접속
2. GitHub 계정으로 로그인

### 2. PostgreSQL 데이터베이스 생성
1. New Project 클릭
2. "Provision PostgreSQL" 선택
3. 데이터베이스가 생성되면 `DATABASE_URL` 환경 변수 자동 설정됨

### 3. Backend 배포
1. 같은 프로젝트에서 "New Service" 클릭
2. "GitHub Repo" 선택
3. 저장소 선택 및 Root Directory를 `backend`로 설정
4. 환경 변수 추가:
   ```
   NODE_ENV=production
   JWT_SECRET=your-production-secret-key
   PORT=3001
   ```
5. Build Command: `npm install && npm run prisma:generate && npm run build`
6. Start Command: `npm run prisma:migrate && npm start`
7. Deploy 클릭

### 4. Frontend 배포
1. 같은 프로젝트에서 "New Service" 클릭
2. "GitHub Repo" 선택
3. 저장소 선택 및 Root Directory를 `frontend`로 설정
4. 환경 변수 추가:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
5. Build Command: `npm install && npm run build`
6. Start Command: `npx serve -s dist -l $PORT`
7. Deploy 클릭

### 5. 데이터 시딩
Railway 대시보드에서:
1. Backend 서비스 선택
2. "Settings" → "Deploy Triggers"
3. 또는 로컬에서 Railway CLI 사용:
   ```bash
   railway login
   railway link
   railway run npm run prisma:seed
   ```

## 방법 2: Vercel (Frontend) + Render (Backend)

### Vercel에 Frontend 배포

1. Vercel 계정 생성 (https://vercel.com)
2. "New Project" 클릭
3. GitHub 저장소 가져오기
4. 설정:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 환경 변수 설정:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy 클릭

### Render에 Backend 배포

1. Render 계정 생성 (https://render.com)
2. "New +" → "Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   - Name: elementary-math-backend
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm run prisma:migrate && npm start`
5. 환경 변수 설정:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   ```
6. "Create Web Service" 클릭

### Render에 PostgreSQL 추가

1. Render 대시보드에서 "New +" → "PostgreSQL" 선택
2. 데이터베이스 이름 설정
3. 생성 후 Internal Database URL 복사
4. Backend 서비스의 환경 변수 `DATABASE_URL`에 붙여넣기

## 방법 3: AWS를 이용한 배포

### 준비물
- AWS 계정
- AWS CLI 설치
- 도메인 (선택사항)

### Backend 배포 (Elastic Beanstalk)

1. Elastic Beanstalk 애플리케이션 생성
   ```bash
   eb init -p node.js elementary-math-backend
   ```

2. 환경 생성 및 배포
   ```bash
   eb create production-env
   eb setenv DATABASE_URL=your-db-url JWT_SECRET=your-secret
   eb deploy
   ```

3. RDS PostgreSQL 데이터베이스 생성
   - RDS 콘솔에서 PostgreSQL 인스턴스 생성
   - 보안 그룹 설정하여 EB 환경에서 접근 가능하도록 설정

### Frontend 배포 (S3 + CloudFront)

1. S3 버킷 생성
   ```bash
   aws s3 mb s3://elementary-math-frontend
   ```

2. 빌드 및 업로드
   ```bash
   cd frontend
   npm run build
   aws s3 sync dist/ s3://elementary-math-frontend
   ```

3. CloudFront 배포 생성
   - S3 버킷을 오리진으로 설정
   - SSL 인증서 적용

## 데이터베이스 마이그레이션

### 프로덕션 마이그레이션 실행

```bash
# Railway
railway run npm run prisma:migrate

# Render (자동으로 Start Command에서 실행됨)

# 직접 실행
DATABASE_URL="your-production-db-url" npm run prisma:migrate
```

### 초기 데이터 시딩

```bash
# Railway
railway run npm run prisma:seed

# Render
# Render Shell에서 실행
npm run prisma:seed

# 직접 실행
DATABASE_URL="your-production-db-url" npm run prisma:seed
```

## 환경 변수 설정

### Backend 필수 환경 변수

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=super-secret-key-change-this-in-production
PORT=3001
NODE_ENV=production
```

### Frontend 필수 환경 변수

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 보안 설정

### 1. CORS 설정
Backend `src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

### 2. Rate Limiting 추가
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 최대 100 요청
});

app.use('/api/', limiter);
```

### 3. Helmet 추가 (보안 헤더)
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

## 모니터링 설정

### 1. 로그 관리
- Railway: 내장 로그 뷰어 사용
- Render: 로그 스트림 확인
- CloudWatch (AWS): 로그 그룹 설정

### 2. 에러 추적
Sentry 설정:
```bash
npm install @sentry/node @sentry/react
```

Backend:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

Frontend:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE
});
```

## 성능 최적화

### 1. Frontend
- 이미지 최적화 (WebP 형식)
- 코드 스플리팅
- CDN 사용
- Gzip/Brotli 압축

### 2. Backend
- 데이터베이스 인덱스 최적화
- 쿼리 캐싱 (Redis)
- API 응답 캐싱
- 커넥션 풀링

### 3. 데이터베이스
```sql
-- 자주 조회되는 컬럼에 인덱스 추가
CREATE INDEX idx_problems_unit ON problems(unit_id);
CREATE INDEX idx_attempts_user ON problem_attempts(user_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);
```

## 백업 전략

### 자동 백업 설정
1. Railway: 자동 백업 기능 활성화
2. Render: PostgreSQL 자동 백업 제공
3. AWS RDS: 자동 스냅샷 설정

### 수동 백업
```bash
# 백업 생성
pg_dump DATABASE_URL > backup.sql

# 백업 복원
psql DATABASE_URL < backup.sql
```

## 문제 해결

### 배포 실패 시
1. 빌드 로그 확인
2. 환경 변수 검증
3. 데이터베이스 연결 확인
4. 포트 설정 확인

### 데이터베이스 연결 오류
- SSL 모드 확인 (프로덕션에서는 `?sslmode=require` 추가)
- 방화벽/보안 그룹 설정 확인
- 연결 문자열 형식 확인

### CORS 오류
- Backend CORS 설정 확인
- Frontend API URL 확인
- 프리플라이트 요청 처리 확인

## 체크리스트

배포 후 확인사항:
- [ ] 홈페이지 접속 가능
- [ ] 회원가입/로그인 동작
- [ ] 단원 목록 로드
- [ ] 문제 풀이 및 채점
- [ ] 오답노트 기능
- [ ] 성취도 분석
- [ ] 모바일 반응형
- [ ] HTTPS 적용
- [ ] 성능 테스트 (Lighthouse)
- [ ] 보안 테스트

## 추가 리소스

- [Railway 문서](https://docs.railway.app)
- [Vercel 문서](https://vercel.com/docs)
- [Render 문서](https://render.com/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
