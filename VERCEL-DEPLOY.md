# Vercel Frontend 배포 가이드

## Vercel 프로젝트 설정

### 1. GitHub 저장소 연결
1. Vercel 대시보드 접속
2. "New Project" 클릭
3. `drtknoh-sudo/basicmath` 저장소 선택

### 2. 프로젝트 설정

**중요: 다음 설정을 정확하게 입력하세요**

#### Framework Preset
- **선택**: `Vite`

#### Root Directory
- **설정**: `frontend`
- 폴더 아이콘을 클릭하여 `frontend` 선택

#### Build and Output Settings

**Build Command** (Override 체크):
```
npm run build
```

**Output Directory** (Override 체크):
```
dist
```

**Install Command** (기본값 사용):
```
npm install
```

### 3. 환경 변수 설정

배포 전 또는 후에 환경 변수를 추가해야 합니다:

1. "Environment Variables" 섹션 또는 Settings → Environment Variables
2. 다음 변수 추가:

#### 로컬 테스트용 (백엔드 미배포 시)
```
Name: VITE_API_URL
Value: http://localhost:3001/api
Environment: Development
```

#### 프로덕션 (백엔드 배포 후)
```
Name: VITE_API_URL
Value: https://your-backend-url.up.railway.app/api
Environment: Production, Preview
```

**주의**: Railway 등에 백엔드를 먼저 배포한 후 해당 URL을 입력하세요.

### 4. 배포 시작
- "Deploy" 버튼 클릭
- 2-3분 대기

### 5. 배포 확인

배포 완료 후:
1. 생성된 URL 확인 (예: `https://basicmath-xxx.vercel.app`)
2. 브라우저에서 접속
3. 메인 페이지 로딩 확인

### 6. 백엔드 연결

**중요**: 백엔드가 배포되지 않으면 로그인/회원가입이 작동하지 않습니다.

백엔드 배포 후:
1. Settings → Environment Variables
2. `VITE_API_URL` 값을 백엔드 URL로 업데이트
3. Deployments → 최신 배포 → ⋯ → Redeploy

## 문제 해결

### 빌드 오류: "Cannot find module"

**원인**: Root Directory가 설정되지 않음

**해결**:
1. Settings → General
2. Root Directory를 `frontend`로 설정
3. Save
4. Redeploy

### 빌드 오류: "Command not found"

**원인**: Build Command가 잘못됨

**해결**:
1. Settings → Build & Development Settings
2. Build Command를 `npm run build`로 설정
3. Output Directory를 `dist`로 설정
4. Save
5. Redeploy

### 런타임 오류: "API call failed"

**원인**: 백엔드가 배포되지 않았거나 VITE_API_URL이 잘못됨

**해결**:
1. 백엔드를 먼저 배포 (Railway 등)
2. Vercel에서 VITE_API_URL 환경 변수 추가
3. Redeploy

### CORS 오류

**원인**: 백엔드 CORS 설정 문제

**해결**:
- 백엔드가 이미 Vercel 도메인을 허용하도록 설정되어 있음
- Railway에 `FRONTEND_URL` 환경 변수 추가 (선택사항)

## 배포 순서 (권장)

1. **백엔드 먼저 배포** (Railway)
   - [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md) 참조
   - 백엔드 URL 메모

2. **프론트엔드 배포** (Vercel)
   - 이 가이드 따라 배포
   - `VITE_API_URL`에 백엔드 URL 설정

3. **테스트**
   - 회원가입/로그인 테스트
   - 단원 목록 확인
   - 문제 풀이 테스트

## 자동 배포

GitHub에 푸시하면 Vercel이 자동으로 재배포합니다:

```bash
git add .
git commit -m "Update frontend"
git push
```

Vercel이 자동으로:
1. 새 커밋 감지
2. 빌드 시작
3. 배포 완료

## 도메인 설정 (선택)

커스텀 도메인을 사용하려면:

1. Settings → Domains
2. 도메인 입력 (예: `math.yourdomain.com`)
3. DNS 설정 안내 따르기
4. SSL 자동 설정됨

## 비용

Vercel은:
- Hobby 플랜: **무료**
- 무제한 대역폭
- 자동 SSL
- GitHub 자동 배포

개인/취미 프로젝트는 완전 무료입니다.
