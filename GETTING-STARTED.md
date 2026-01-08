# 시작 가이드

이 가이드는 개발 환경 설정부터 프로젝트 실행까지의 전 과정을 안내합니다.

## 목차
1. [시스템 요구사항](#시스템-요구사항)
2. [개발 환경 설정](#개발-환경-설정)
3. [프로젝트 설치](#프로젝트-설치)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [프로젝트 실행](#프로젝트-실행)
6. [첫 사용자 생성](#첫-사용자-생성)
7. [문제 해결](#문제-해결)

## 시스템 요구사항

### 필수 소프트웨어
- **Node.js**: v18.0.0 이상
- **npm**: v9.0.0 이상 (Node.js와 함께 설치됨)
- **PostgreSQL**: v14.0 이상

### 권장 개발 도구
- **VSCode** 또는 다른 코드 에디터
- **Git**: 버전 관리
- **Postman** 또는 **Insomnia**: API 테스트 (선택사항)

## 개발 환경 설정

### 1. Node.js 설치

#### macOS (Homebrew 사용)
\`\`\`bash
brew install node
\`\`\`

#### Windows
1. https://nodejs.org 에서 LTS 버전 다운로드
2. 설치 프로그램 실행
3. 설치 확인:
\`\`\`bash
node --version
npm --version
\`\`\`

#### Linux (Ubuntu/Debian)
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### 2. PostgreSQL 설치

#### macOS (Homebrew 사용)
\`\`\`bash
brew install postgresql@14
brew services start postgresql@14
\`\`\`

#### Windows
1. https://www.postgresql.org/download/windows/ 에서 다운로드
2. 설치 프로그램 실행
3. 설치 중 비밀번호 설정 (기억해두세요!)

#### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
\`\`\`

#### Docker 사용 (모든 OS)
\`\`\`bash
docker run --name elementary-math-db \
  -e POSTGRES_USER=mathuser \
  -e POSTGRES_PASSWORD=mathpass \
  -e POSTGRES_DB=elementary_math \
  -p 5432:5432 \
  -d postgres:14
\`\`\`

## 프로젝트 설치

### 1. 프로젝트 디렉토리로 이동
\`\`\`bash
cd elementary-math-app
\`\`\`

### 2. 전체 의존성 설치
\`\`\`bash
npm install
\`\`\`

이 명령어는 루트, backend, frontend의 모든 의존성을 설치합니다.

### 3. 개별 설치 (선택사항)
\`\`\`bash
# Backend만
cd backend
npm install

# Frontend만
cd frontend
npm install
\`\`\`

## 데이터베이스 설정

### 1. PostgreSQL 데이터베이스 생성

PostgreSQL에 접속:
\`\`\`bash
# macOS/Linux
psql postgres

# Windows (Command Prompt)
psql -U postgres
\`\`\`

데이터베이스 생성:
\`\`\`sql
CREATE DATABASE elementary_math;
CREATE USER mathuser WITH PASSWORD 'mathpass';
GRANT ALL PRIVILEGES ON DATABASE elementary_math TO mathuser;
\q
\`\`\`

### 2. 환경 변수 설정

Backend 디렉토리에서:
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

`.env` 파일을 열고 데이터베이스 연결 정보 수정:
\`\`\`env
DATABASE_URL="postgresql://mathuser:mathpass@localhost:5432/elementary_math?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
NODE_ENV=development
\`\`\`

Frontend 디렉토리에서:
\`\`\`bash
cd ../frontend
cp .env.example .env
\`\`\`

`.env` 파일 확인:
\`\`\`env
VITE_API_URL=http://localhost:3001/api
\`\`\`

### 3. 데이터베이스 마이그레이션

Backend 디렉토리에서:
\`\`\`bash
cd backend
npm run prisma:generate
npm run prisma:migrate
\`\`\`

성공하면 다음과 같은 메시지가 표시됩니다:
\`\`\`
✔ Generated Prisma Client
✔ Applied migration
\`\`\`

### 4. 샘플 데이터 추가

\`\`\`bash
npm run prisma:seed
\`\`\`

성공 메시지:
\`\`\`
✅ Database seeded successfully!
📚 Created 6 units
💡 Created concepts and problems for sample units
\`\`\`

## 프로젝트 실행

### 방법 1: 모든 서비스 동시 실행 (추천)

루트 디렉토리에서:
\`\`\`bash
npm run dev
\`\`\`

이 명령어는 Backend와 Frontend를 동시에 실행합니다.

### 방법 2: 개별 실행

#### 터미널 1 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

서버가 시작되면:
\`\`\`
🚀 Server running on http://localhost:3001
\`\`\`

#### 터미널 2 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

개발 서버가 시작되면:
\`\`\`
  VITE v6.0.7  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
\`\`\`

### 3. 브라우저에서 접속

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 첫 사용자 생성

### 1. 브라우저에서 회원가입

1. http://localhost:3000 접속
2. "회원가입" 클릭
3. 정보 입력:
   - 이름: 홍길동
   - 사용자명: student1
   - 학년: 3학년
   - 비밀번호: password123
   - 비밀번호 확인: password123
4. "회원가입" 버튼 클릭

### 2. 로그인

회원가입 후 자동으로 로그인되거나, 수동으로 로그인:
- 사용자명: student1
- 비밀번호: password123

### 3. 기능 테스트

로그인 후 다음 기능들을 테스트해보세요:

1. **대시보드**: 학습 통계 확인
2. **학습하기**: 단원 선택 → 개념 학습 → 문제 풀기
3. **오답노트**: 틀린 문제 확인 및 복습
4. **성취도**: 학습 성과 분석

## 문제 해결

### PostgreSQL 연결 오류

**증상**:
\`\`\`
Error: P1001: Can't reach database server
\`\`\`

**해결방법**:
1. PostgreSQL이 실행 중인지 확인:
   \`\`\`bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql

   # Docker
   docker ps
   \`\`\`

2. 포트 확인 (기본 5432):
   \`\`\`bash
   lsof -i :5432
   \`\`\`

3. 연결 정보 확인:
   - DATABASE_URL의 호스트, 포트, 사용자명, 비밀번호가 정확한지 확인

### Prisma 마이그레이션 오류

**증상**:
\`\`\`
Error: Migration failed
\`\`\`

**해결방법**:
1. 데이터베이스 초기화:
   \`\`\`bash
   npm run prisma:migrate reset
   \`\`\`

2. 처음부터 다시:
   \`\`\`bash
   rm -rf prisma/migrations
   npm run prisma:migrate dev --name init
   \`\`\`

### 포트 충돌

**증상**:
\`\`\`
Error: Port 3000 is already in use
\`\`\`

**해결방법**:
1. 포트를 사용 중인 프로세스 확인:
   \`\`\`bash
   # macOS/Linux
   lsof -i :3000

   # Windows
   netstat -ano | findstr :3000
   \`\`\`

2. 프로세스 종료 또는 다른 포트 사용:
   \`\`\`bash
   # Frontend
   PORT=3001 npm run dev

   # Backend
   # .env 파일에서 PORT 변경
   \`\`\`

### CORS 오류

**증상**:
\`\`\`
Access to fetch at 'http://localhost:3001/api/...' has been blocked by CORS policy
\`\`\`

**해결방법**:
1. Backend가 실행 중인지 확인
2. `backend/src/index.ts`에서 CORS 설정 확인
3. Frontend `.env`에서 VITE_API_URL 확인

### 의존성 설치 오류

**증상**:
\`\`\`
npm ERR! code ERESOLVE
\`\`\`

**해결방법**:
1. Node.js 버전 확인 (18 이상):
   \`\`\`bash
   node --version
   \`\`\`

2. npm 캐시 정리:
   \`\`\`bash
   npm cache clean --force
   \`\`\`

3. node_modules 삭제 후 재설치:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

## 유용한 명령어

### Prisma 관련
\`\`\`bash
# Prisma Studio 실행 (데이터베이스 GUI)
cd backend
npm run prisma:studio

# 데이터베이스 리셋 (개발 중)
npm run prisma:migrate reset

# 스키마 재생성
npm run prisma:generate
\`\`\`

### 개발 도구
\`\`\`bash
# Backend 빌드
cd backend
npm run build

# Frontend 빌드
cd frontend
npm run build

# TypeScript 타입 체크
npm run type-check  # (package.json에 스크립트 추가 필요)
\`\`\`

## 다음 단계

프로젝트가 정상적으로 실행되면:

1. **코드 탐색**:
   - `backend/src/routes/` - API 엔드포인트
   - `frontend/src/pages/` - 페이지 컴포넌트
   - `backend/prisma/schema.prisma` - 데이터베이스 스키마

2. **문제 추가**:
   - `backend/prisma/seed.ts` 수정
   - 단원, 개념, 문제 추가
   - `npm run prisma:seed` 실행

3. **기능 개발**:
   - 새로운 API 엔드포인트 추가
   - UI 컴포넌트 개발
   - 비즈니스 로직 구현

4. **배포 준비**:
   - [DEPLOYMENT.md](./DEPLOYMENT.md) 참조
   - 프로덕션 환경 설정

## 추가 리소스

- [README.md](./README.md) - 프로젝트 개요
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
- [Prisma 문서](https://www.prisma.io/docs)
- [React 문서](https://react.dev)
- [Express 문서](https://expressjs.com)

## 도움이 필요하신가요?

문제가 해결되지 않으면:
1. GitHub Issues에 질문 등록
2. 에러 메시지 전체 복사
3. 환경 정보 포함 (OS, Node.js 버전 등)
