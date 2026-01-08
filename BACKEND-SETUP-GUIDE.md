# 백엔드 완전 설정 가이드

이 가이드는 백엔드를 완전히 설정하고 교육부 자료 기반의 문제 은행을 구축하는 방법을 설명합니다.

## 현재 상태

### ✅ 완료된 작업
1. **프론트엔드**: Vercel에 배포됨 (데모 모드)
2. **백엔드 코드**: 완전히 구현됨
3. **데이터베이스 스키마**: 설계 완료
4. **샘플 데이터**: 1학년, 3학년 문제 포함
5. **CORS 설정**: Vercel 도메인 허용

### 🔄 진행 필요
1. **백엔드 배포**: Railway 또는 Render
2. **데이터베이스**: PostgreSQL 설정
3. **문제 은행 확장**: 전 학년 문제 추가
4. **환경 변수**: Vercel 연결

## 1단계: 로컬 백엔드 실행

### 필수 요구사항
- Node.js 18+
- PostgreSQL 14+

### 설치 및 실행

```bash
# 1. 프로젝트 디렉토리로 이동
cd elementary-math-app

# 2. 의존성 설치
npm install

# 3. PostgreSQL 데이터베이스 생성
psql postgres
CREATE DATABASE elementary_math;
CREATE USER mathuser WITH PASSWORD 'mathpass';
GRANT ALL PRIVILEGES ON DATABASE elementary_math TO mathuser;
\q

# 4. 백엔드 환경 변수 설정
cd backend
cp .env.example .env

# .env 파일 편집:
DATABASE_URL="postgresql://mathuser:mathpass@localhost:5432/elementary_math?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development

# 5. 데이터베이스 마이그레이션
npm run prisma:generate
npm run prisma:migrate

# 6. 종합 데이터 시딩 (교육과정 기반 문제 포함)
npx tsx prisma/comprehensive-seed.ts

# 7. 백엔드 서버 실행
npm run dev
```

백엔드가 http://localhost:3001 에서 실행됩니다.

### 헬스 체크
```bash
curl http://localhost:3001/health
```

## 2단계: 프론트엔드와 연결

### 프론트엔드 환경 변수 설정

```bash
cd ../frontend
cp .env.example .env

# .env 파일 편집:
VITE_API_URL=http://localhost:3001/api
```

### 프론트엔드 실행
```bash
npm run dev
```

프론트엔드가 http://localhost:3000 에서 실행됩니다.

### 테스트
1. 브라우저에서 http://localhost:3000 접속
2. "학습하기" 클릭
3. 단원 목록이 백엔드에서 로드되는지 확인

## 3단계: Railway 배포

### Railway 프로젝트 생성

1. **https://railway.app** 접속 및 GitHub 로그인
2. **"New Project"** 클릭
3. **"Provision PostgreSQL"** 클릭

### Backend 서비스 추가

1. 같은 프로젝트에서 **"+ New"** 클릭
2. **"GitHub Repo"** 선택
3. **drtknoh-sudo/basicmath** 저장소 선택

### 환경 변수 설정

Backend 서비스의 **"Variables"** 탭:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=랜덤-긴-문자열-생성-필요
```

**DATABASE_URL**은 PostgreSQL 서비스에서 자동 추가됩니다.

### 배포 설정

**Settings → Deploy**:

**Root Directory**: `backend`

**Custom Build Command**:
```
npm install && npm run prisma:generate && npm run build
```

**Custom Start Command**:
```
npm run prisma:migrate && npx tsx prisma/comprehensive-seed.ts && npm start
```

### 배포 시작
- "Deploy" 클릭
- 빌드 로그 확인 (3-5분 소요)

### Backend URL 확인
1. "Settings" → "Domains"
2. 생성된 URL 복사 (예: `https://basicmath-production.up.railway.app`)

## 4단계: Vercel 연결

### Vercel 환경 변수 업데이트

1. Vercel 대시보드 → 프로젝트 선택
2. "Settings" → "Environment Variables"
3. 기존 VITE_API_URL 삭제
4. 새 변수 추가:

```
Name: VITE_API_URL
Value: https://your-backend-url.up.railway.app/api
Environment: Production, Preview
```

5. "Save" 클릭
6. "Deployments" 탭 → 최신 배포 → "⋯" → "Redeploy"

## 5단계: 교육부 자료 기반 문제 확장

### 현재 포함된 문제 (comprehensive-seed.ts)

#### 1학년 1학기 - 9까지의 수
- ✅ 개념 2개
- ✅ 검증된 문제 5개
- 출처: 2022 개정 교육과정

#### 3학년 1학기 - 덧셈과 뺄셈
- ✅ 개념 2개
- ✅ 검증된 문제 5개
- 출처: 2022 개정 교육과정

### 문제 확장 방법

문제를 추가하려면 `backend/prisma/comprehensive-seed.ts` 파일을 수정하세요.

#### 추가 권장 출처:

1. **EBSMath (https://ebsmath.co.kr/)**
   - 학년별, 단원별 문제 제공
   - 무료 접근 가능

2. **천재교육 (https://text.tsherpa.co.kr/)**
   - 교과서 문제 및 평가 자료
   - 교사용 자료 활용

3. **동아출판 (https://eltextbook.dong-a.com/)**
   - 단원평가, 차시별 문제
   - 체계적인 문제 구조

4. **국가교육과정정보센터 (https://ncic.re.kr/)**
   - 공식 교육과정 문서
   - 성취기준 및 학습 목표

### 문제 추가 템플릿

```typescript
{
  difficulty: 1, // 1-5: 낮음-높음
  type: '객관식', // '객관식', '단답형', '서술형'
  question: '문제 내용을 입력하세요.',
  answer: '정답',
  explanation: '해설을 입력하세요.',
  choices: ['선택1', '선택2', '선택3', '선택4'], // 객관식만
  steps: [
    { stepNumber: 1, description: '단계 설명', expectedValue: '예상값' },
    { stepNumber: 2, description: '단계 설명', expectedValue: '예상값' }
  ]
}
```

### 학년별 추가 우선순위

1. **1-2학년**: 기초 개념 (2024년 시행)
2. **3-4학년**: 핵심 개념 (2025년 시행)
3. **5-6학년**: 심화 개념 (2026년 시행)

## 6단계: 전체 시스템 테스트

### 테스트 체크리스트

#### 백엔드 테스트
- [ ] Health check: `https://your-backend.railway.app/health`
- [ ] 단원 목록: `https://your-backend.railway.app/api/units`
- [ ] 특정 단원: `https://your-backend.railway.app/api/units/{id}`

#### 프론트엔드 테스트
- [ ] 메인 페이지 로딩
- [ ] 단원 목록 표시 (백엔드에서 로드)
- [ ] 단원 필터링 (학년, 학기, 영역)
- [ ] 개념 학습 페이지
- [ ] 문제 풀이 페이지

#### 통합 테스트
- [ ] 문제 제출 및 채점
- [ ] 오답노트 생성
- [ ] 성취도 계산

## 문제 해결

### "백엔드 연결 실패"
- Railway 서비스가 실행 중인지 확인
- Vercel VITE_API_URL이 올바른지 확인
- CORS 설정 확인 (backend/src/index.ts)

### "데이터베이스 연결 오류"
- DATABASE_URL 확인
- PostgreSQL 서비스 실행 확인
- SSL 모드: `?sslmode=require` 추가

### "문제가 표시되지 않음"
- 데이터 시딩 완료 확인
- Railway 로그에서 오류 확인
- API 엔드포인트 테스트

## 추가 개선 사항

### 단기 (1-2주)
1. 모든 학년 문제 추가 (50+ 문제/단원)
2. 이미지 자료 추가
3. 동영상 설명 링크

### 중기 (1-3개월)
1. AI 기반 문제 생성
2. 맞춤형 난이도 조절
3. 학습 분석 대시보드

### 장기 (3-6개월)
1. 모바일 앱 개발
2. 학부모 모니터링 기능
3. 게임화 요소 추가

## 참고 자료

- [2022 개정 교육과정 수학과](https://namu.wiki/w/2022%20%EA%B0%9C%EC%A0%95%20%EA%B5%90%EC%9C%A1%EA%B3%BC%EC%A0%95/%EC%88%98%ED%95%99%EA%B3%BC)
- [EBSMath](https://ebsmath.co.kr/)
- [지학사 교과서](https://textbook.jihak.co.kr/)
- [Railway 문서](https://docs.railway.app/)
- [Prisma 문서](https://www.prisma.io/docs)

## 다음 단계

1. ✅ 로컬 백엔드 실행
2. ✅ 데이터 시딩 확인
3. 🔄 Railway 배포
4. 🔄 Vercel 연결
5. 🔄 문제 은행 확장

완료되면 완전히 작동하는 풀스택 학습 플랫폼이 됩니다! 🚀
