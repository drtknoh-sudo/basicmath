# AI 에이전트 기반 학습 시스템 가이드

## 개요

이 프로젝트는 백엔드 서버 대신 **AI 에이전트**를 사용하여 각 학년과 단원별로 맞춤형 학습 콘텐츠를 실시간으로 생성합니다.

### 주요 특징

- 🤖 **전담 AI 선생님**: 각 단원마다 특화된 AI 에이전트가 배정
- 💡 **실시간 콘텐츠 생성**: 개념 설명과 문제를 즉시 생성
- 📝 **무한 문제 생성**: 난이도별 맞춤형 문제를 원하는 만큼 생성
- 💬 **대화형 학습**: 학생이 질문하면 AI가 즉시 답변
- 🎯 **맞춤형 피드백**: 오답 분석 및 단계별 힌트 제공

## 시스템 구조

### AI 에이전트 타입

#### 1. ConceptLearningAgent (개념 학습 에이전트)
```typescript
const agent = createConceptAgent(grade: number, unitId: string);
```

**역할:**
- 해당 학년 수준에 맞춘 개념 설명 생성
- 구체적인 예제와 풀이 과정 제공
- 학생 질문에 대화형으로 답변
- 2022 개정 교육과정 기반 콘텐츠

**기능:**
- `getConcepts()`: 단원의 핵심 개념 2-3개 생성
- `askQuestion(question)`: 학생 질문에 답변

#### 2. ProblemSolvingAgent (문제 풀이 에이전트)
```typescript
const agent = createProblemAgent(grade: number, unitId: string);
```

**역할:**
- 난이도별 문제 생성 (1-5)
- 객관식, 단답형, 서술형 문제 출제
- 정확한 채점 및 상세 해설 제공
- 오답 단계 분석

**기능:**
- `generateProblems(count, difficulty?)`: 문제 생성
- `checkAnswer(problem, answer, steps?)`: 답안 채점
- `getHint(problem)`: 힌트 제공

## 설치 및 설정

### 1. 의존성 설치

```bash
cd elementary-math-app/frontend
npm install
```

### 2. Anthropic API 키 설정

1. [Anthropic Console](https://console.anthropic.com/)에서 API 키 발급
2. `.env` 파일 생성:

```bash
cp .env.example .env
```

3. `.env` 파일 편집:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 사용 방법

### 개념 학습

1. **단원 선택**: 학년과 단원 선택
2. **개념 학습 클릭**: AI가 실시간으로 개념 생성
3. **예제 학습**: 단계별 풀이 과정 확인
4. **질문하기**: 궁금한 점을 AI에게 질문

### 문제 풀기

1. **문제 풀기 클릭**: 단원의 문제 생성
2. **난이도 선택**: 1(쉬움) ~ 5(어려움)
3. **문제 풀이**: 답안 입력 및 제출
4. **AI 채점**: 즉시 채점 및 상세 피드백
5. **오답 분석**: 틀린 단계 파악 및 힌트

## AI 에이전트 아키텍처

```
frontend/src/services/aiAgent.ts
├── GRADE_UNITS              # 전 학년 단원 정보
├── ConceptLearningAgent     # 개념 학습 에이전트
│   ├── getConcepts()        # 개념 생성
│   └── askQuestion()        # 질문 응답
└── ProblemSolvingAgent      # 문제 풀이 에이전트
    ├── generateProblems()   # 문제 생성
    ├── checkAnswer()        # 답안 채점
    └── getHint()            # 힌트 제공
```

## 학년별 단원 구성

### 1학년 (4개 단원)
- 9까지의 수
- 여러 가지 모양
- 덧셈과 뺄셈
- 비교하기

### 2학년 (4개 단원)
- 세 자리 수
- 덧셈과 뺄셈
- 길이 재기
- 곱셈

### 3학년 (4개 단원)
- 덧셈과 뺄셈
- 평면도형
- 나눗셈
- 곱셈

### 4학년 (4개 단원)
- 큰 수
- 곱셈과 나눗셈
- 각도
- 분수의 덧셈과 뺄셈

### 5학년 (4개 단원)
- 약수와 배수
- 분수의 덧셈과 뺄셈
- 규칙과 대응
- 약분과 통분

### 6학년 (4개 단원)
- 분수의 나눗셈
- 비와 비율
- 소수의 나눗셈
- 공간과 입체

## AI 프롬프트 설계

### 개념 학습 에이전트 프롬프트

```
당신은 {grade}학년 학생들을 위한 친절한 수학 선생님입니다.
현재 가르치는 단원: {unitName}

역할:
1. 2022 개정 교육과정 기반 개념 설명
2. 학생 수준에 맞춘 쉬운 설명
3. 구체적 예시와 시각적 설명
4. 인내심 있는 질문 응답
5. 격려와 긍정적 피드백

설명 방식:
- 개념 핵심 소개
- 구체적 예시 2-3개
- 단계별 풀이 과정
- 이해도 확인 질문
```

### 문제 풀이 에이전트 프롬프트

```
당신은 {grade}학년 수학 문제 출제 및 채점 전문 교사입니다.

역할:
1. 교육과정 기반 문제 생성
2. 난이도별 다양한 문제
3. 정확한 채점과 해설
4. 오답 분석 및 피드백

문제 유형:
- 객관식 (4지선다)
- 단답형 (짧은 답)
- 서술형 (풀이 과정 포함)

채점 기준:
- 정확한 답 확인
- 풀이 과정 검토
- 오류 단계 파악
- 건설적 피드백
```

## 비용 관리

### Anthropic API 사용량

- **개념 생성**: ~2,000 tokens per concept
- **문제 생성**: ~1,500 tokens per problem
- **답안 채점**: ~500 tokens per submission
- **질문 응답**: ~800 tokens per question

### 예상 비용 (Claude 3.5 Sonnet 기준)

**학생 1명, 1시간 학습 기준:**
- 개념 학습: 3개 개념 × 2,000 tokens = 6,000 tokens
- 문제 풀이: 10문제 × 1,500 tokens = 15,000 tokens
- 답안 채점: 10개 × 500 tokens = 5,000 tokens
- 질문 응답: 5개 × 800 tokens = 4,000 tokens
- **총계: ~30,000 tokens ≈ $0.09 USD**

### 비용 절감 팁

1. **캐싱 활용**: 동일 단원은 개념 재사용
2. **배치 처리**: 여러 문제 한 번에 생성
3. **난이도 조절**: 쉬운 문제는 짧은 프롬프트
4. **로컬 저장**: 생성된 콘텐츠 브라우저에 캐싱

## 프로덕션 배포

### 보안 고려사항

⚠️ **현재 구현 (개발용)**
```typescript
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true  // 개발용만!
});
```

✅ **프로덕션 권장 아키텍처**

```
Frontend (Vercel)
    ↓ HTTPS
Backend Proxy (Cloudflare Workers / Vercel Functions)
    ↓ API Key (서버 환경변수)
Anthropic API
```

**프록시 함수 예시:**

```typescript
// api/generate-concept.ts (Vercel Function)
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY, // 서버 환경변수
  });

  const { grade, unitId } = req.body;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  res.json(response);
}
```

### Vercel 배포

1. **환경 변수 설정** (Vercel Dashboard):
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

2. **빌드 및 배포**:
```bash
npm run build
vercel --prod
```

## 트러블슈팅

### 문제: "개념을 불러올 수 없습니다"

**원인:** API 키가 설정되지 않았거나 잘못됨

**해결:**
1. `.env` 파일 확인
2. API 키 형식 확인 (`sk-ant-api03-...`)
3. 개발 서버 재시작

### 문제: API 호출이 느림

**원인:** 네트워크 지연 또는 복잡한 프롬프트

**해결:**
1. 프롬프트 간소화
2. max_tokens 제한
3. 로딩 상태 표시

### 문제: JSON 파싱 오류

**원인:** AI가 잘못된 형식으로 응답

**해결:**
- 프롬프트에 "JSON 형식으로만 반환" 명시
- 기본값 fallback 구현 (이미 포함됨)

## 향후 개선 사항

### 단기 (1-2주)
- [ ] 학습 기록 로컬 저장
- [ ] 오답 노트 기능
- [ ] 성취도 시각화

### 중기 (1-2개월)
- [ ] 백엔드 프록시 구현
- [ ] 캐싱 시스템 도입
- [ ] 학부모 대시보드

### 장기 (3-6개월)
- [ ] 멀티모달 학습 (이미지, 그래프)
- [ ] 음성 설명 기능
- [ ] 협업 학습 모드

## 참고 자료

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude 3.5 Sonnet Guide](https://www.anthropic.com/claude)
- [2022 개정 교육과정](https://www.moe.go.kr/)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)

## 라이센스

MIT License

## 기여

기여는 언제나 환영합니다! Issue나 Pull Request를 자유롭게 작성해주세요.
