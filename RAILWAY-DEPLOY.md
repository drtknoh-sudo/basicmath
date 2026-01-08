# Railway 백엔드 배포 가이드

## 1. Railway 계정 생성
https://railway.app 에서 GitHub 계정으로 로그인

## 2. PostgreSQL 데이터베이스 생성
1. "New Project" 클릭
2. "Provision PostgreSQL" 선택
3. 데이터베이스가 자동으로 생성됩니다

## 3. Backend 서비스 추가
1. 같은 프로젝트에서 "+ New" 클릭
2. "GitHub Repo" 선택
3. `drtknoh-sudo/basicmath` 저장소 선택
4. "Add variables" 클릭

## 4. 환경 변수 설정

다음 환경 변수를 추가하세요:

### 필수 변수
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-production-key-change-this
```

### DATABASE_URL
PostgreSQL 서비스에서 자동으로 추가됩니다.
또는 수동으로 연결:
- PostgreSQL 서비스 클릭
- "Connect" 탭
- "DATABASE_URL" 복사
- Backend 서비스의 Variables에 붙여넣기

### FRONTEND_URL (선택)
Vercel 배포 후 Frontend URL을 추가하세요:
```
FRONTEND_URL=https://your-app.vercel.app
```

## 5. 배포 설정

### Settings → Deploy
- **Build Command**:
  ```
  cd backend && npm install && npm run prisma:generate && npm run build
  ```
- **Start Command**:
  ```
  cd backend && npm run prisma:migrate && npm start
  ```
- **Watch Paths**: `backend/**`

## 6. 배포 시작
1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 대기 (3-5분)

## 7. 데이터 시딩

배포 완료 후 샘플 데이터를 추가하려면:

1. Backend 서비스의 "Settings" 탭
2. 아래로 스크롤하여 "Service Domains" 확인
3. Railway CLI 설치 (선택사항):
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway run npm run prisma:seed
   ```

또는 Railway Shell에서:
```bash
cd backend && npm run prisma:seed
```

## 8. API URL 확인

배포 완료 후:
1. Backend 서비스 클릭
2. "Settings" → "Domains"
3. 생성된 URL 복사 (예: `https://basicmath-backend.up.railway.app`)

## 9. Vercel 환경 변수 업데이트

Vercel 프로젝트 설정에서:
1. "Settings" → "Environment Variables"
2. 다음 변수 추가:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```
3. "Redeploy" 클릭

## 10. 테스트

1. Backend 헬스 체크: `https://your-backend.up.railway.app/health`
2. Frontend에서 회원가입/로그인 테스트

## 문제 해결

### 데이터베이스 연결 오류
- DATABASE_URL이 올바른지 확인
- PostgreSQL 서비스가 실행 중인지 확인
- SSL 모드 확인: `?sslmode=require` 추가

### 빌드 오류
- Build Command가 정확한지 확인
- package.json이 올바른지 확인
- 로그에서 오류 메시지 확인

### CORS 오류
- FRONTEND_URL 환경 변수 설정
- Backend의 CORS 설정 확인

## 비용

Railway는:
- $5/월 크레딧 무료 제공
- 추가 사용량은 사용한 만큼 청구
- 개발/테스트 용도로 충분한 무료 크레딧
