import Anthropic from '@anthropic-ai/sdk';

// AI 에이전트 설정
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // 프로덕션에서는 백엔드 프록시 사용 권장
});

// 학년별 단원 정보
export const GRADE_UNITS = {
  1: [
    { id: '1-1', unitNumber: 1, unitName: '9까지의 수', category: '수와 연산', semester: 1 },
    { id: '1-2', unitNumber: 2, unitName: '여러 가지 모양', category: '도형과 측정', semester: 1 },
    { id: '1-3', unitNumber: 3, unitName: '덧셈과 뺄셈', category: '수와 연산', semester: 1 },
    { id: '1-4', unitNumber: 4, unitName: '비교하기', category: '도형과 측정', semester: 1 },
  ],
  2: [
    { id: '2-1', unitNumber: 1, unitName: '세 자리 수', category: '수와 연산', semester: 1 },
    { id: '2-2', unitNumber: 2, unitName: '덧셈과 뺄셈', category: '수와 연산', semester: 1 },
    { id: '2-3', unitNumber: 3, unitName: '길이 재기', category: '도형과 측정', semester: 1 },
    { id: '2-4', unitNumber: 4, unitName: '곱셈', category: '수와 연산', semester: 1 },
  ],
  3: [
    { id: '3-1', unitNumber: 1, unitName: '덧셈과 뺄셈', category: '수와 연산', semester: 1 },
    { id: '3-2', unitNumber: 2, unitName: '평면도형', category: '도형과 측정', semester: 1 },
    { id: '3-3', unitNumber: 3, unitName: '나눗셈', category: '수와 연산', semester: 1 },
    { id: '3-4', unitNumber: 4, unitName: '곱셈', category: '수와 연산', semester: 1 },
  ],
  4: [
    { id: '4-1', unitNumber: 1, unitName: '큰 수', category: '수와 연산', semester: 1 },
    { id: '4-2', unitNumber: 2, unitName: '곱셈과 나눗셈', category: '수와 연산', semester: 1 },
    { id: '4-3', unitNumber: 3, unitName: '각도', category: '도형과 측정', semester: 1 },
    { id: '4-4', unitNumber: 4, unitName: '분수의 덧셈과 뺄셈', category: '수와 연산', semester: 1 },
  ],
  5: [
    { id: '5-1', unitNumber: 1, unitName: '약수와 배수', category: '수와 연산', semester: 1 },
    { id: '5-2', unitNumber: 2, unitName: '분수의 덧셈과 뺄셈', category: '수와 연산', semester: 1 },
    { id: '5-3', unitNumber: 3, unitName: '규칙과 대응', category: '변화와 관계', semester: 1 },
    { id: '5-4', unitNumber: 4, unitName: '약분과 통분', category: '수와 연산', semester: 1 },
  ],
  6: [
    { id: '6-1', unitNumber: 1, unitName: '분수의 나눗셈', category: '수와 연산', semester: 1 },
    { id: '6-2', unitNumber: 2, unitName: '비와 비율', category: '변화와 관계', semester: 1 },
    { id: '6-3', unitNumber: 3, unitName: '소수의 나눗셈', category: '수와 연산', semester: 1 },
    { id: '6-4', unitNumber: 4, unitName: '공간과 입체', category: '도형과 측정', semester: 1 },
  ],
};

// AI 에이전트 타입
export interface Concept {
  conceptNumber: number;
  title: string;
  explanation: string;
  examples: Array<{
    question: string;
    solution: string;
    steps: string[];
  }>;
}

export interface Problem {
  id: string;
  difficulty: number;
  type: '객관식' | '단답형' | '서술형';
  question: string;
  choices?: string[];
  answer: string;
  explanation: string;
  steps: Array<{
    stepNumber: number;
    description: string;
    expectedValue: string;
  }>;
}

// 개념 학습 에이전트
export class ConceptLearningAgent {
  private grade: number;
  private unitId: string;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(grade: number, unitId: string) {
    this.grade = grade;
    this.unitId = unitId;
  }

  private getUnitInfo() {
    const units = GRADE_UNITS[this.grade as keyof typeof GRADE_UNITS] || [];
    return units.find(u => u.id === this.unitId);
  }

  private getSystemPrompt(): string {
    const unit = this.getUnitInfo();
    return `당신은 ${this.grade}학년 학생들을 위한 친절한 수학 선생님입니다.
현재 가르치는 단원: ${unit?.unitName || '수학'}
영역: ${unit?.category || '수와 연산'}

역할:
1. 2022 개정 교육과정을 기반으로 개념을 설명합니다
2. 학생의 수준에 맞춰 쉽고 친절하게 설명합니다
3. 구체적인 예시와 시각적 설명을 활용합니다
4. 학생의 질문에 인내심을 갖고 답변합니다
5. 격려와 긍정적 피드백을 제공합니다

설명 방식:
- 먼저 개념의 핵심을 간단히 소개
- 구체적인 예시 2-3개 제공
- 단계별로 풀이 과정 설명
- 학생이 이해했는지 확인하는 질문

학년별 특성:
${this.grade <= 2 ? '- 매우 기초적이고 구체적인 설명\n- 그림과 사물로 연결\n- 짧고 단순한 문장' : ''}
${this.grade >= 3 && this.grade <= 4 ? '- 체계적인 설명\n- 논리적 단계 강조\n- 실생활 예시 활용' : ''}
${this.grade >= 5 ? '- 추상적 개념도 다룸\n- 수학적 사고력 강조\n- 심화 내용 포함' : ''}`;
  }

  async getConcepts(): Promise<Concept[]> {
    const unit = this.getUnitInfo();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: this.getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `"${unit?.unitName}" 단원의 핵심 개념 2-3개를 다음 형식으로 생성해주세요:

각 개념마다:
1. 개념 번호와 제목
2. 상세한 설명 (${this.grade}학년 수준에 맞춤)
3. 구체적인 예제 2개 (문제, 풀이, 단계별 설명 포함)

JSON 형식으로 반환:
{
  "concepts": [
    {
      "conceptNumber": 1,
      "title": "개념 제목",
      "explanation": "상세 설명",
      "examples": [
        {
          "question": "예제 문제",
          "solution": "답",
          "steps": ["단계1", "단계2", "단계3"]
        }
      ]
    }
  ]
}`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        // JSON 추출 (```json ... ``` 형식 처리)
        const jsonMatch = content.text.match(/```json\s*([\s\S]*?)\s*```/) ||
                         content.text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
        const data = JSON.parse(jsonText);
        return data.concepts;
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        // 파싱 실패 시 기본 개념 반환
        return this.getDefaultConcepts();
      }
    }

    return this.getDefaultConcepts();
  }

  private getDefaultConcepts(): Concept[] {
    const unit = this.getUnitInfo();
    return [
      {
        conceptNumber: 1,
        title: `${unit?.unitName} 기초`,
        explanation: `${unit?.unitName}의 기본 개념을 배웁니다.`,
        examples: [
          {
            question: '기본 예제',
            solution: '답',
            steps: ['1단계', '2단계', '3단계']
          }
        ]
      }
    ];
  }

  async askQuestion(question: string): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      content: question
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: this.getSystemPrompt(),
      messages: this.conversationHistory
    });

    const content = response.content[0];
    if (content.type === 'text') {
      this.conversationHistory.push({
        role: 'assistant',
        content: content.text
      });
      return content.text;
    }

    return '죄송합니다. 답변을 생성할 수 없습니다.';
  }
}

// 문제 풀이 에이전트
export class ProblemSolvingAgent {
  private grade: number;
  private unitId: string;

  constructor(grade: number, unitId: string) {
    this.grade = grade;
    this.unitId = unitId;
  }

  private getUnitInfo() {
    const units = GRADE_UNITS[this.grade as keyof typeof GRADE_UNITS] || [];
    return units.find(u => u.id === this.unitId);
  }

  private getSystemPrompt(): string {
    const unit = this.getUnitInfo();
    return `당신은 ${this.grade}학년 수학 문제를 출제하고 채점하는 전문 교사입니다.
현재 단원: ${unit?.unitName || '수학'}
영역: ${unit?.category || '수와 연산'}

역할:
1. 2022 개정 교육과정 기반 문제 생성
2. 난이도별 (1-5) 다양한 문제 제공
3. 객관식, 단답형, 서술형 문제 출제
4. 정확한 채점과 상세한 해설 제공
5. 학생의 오답 분석 및 피드백

문제 생성 기준:
- 난이도 1-2: 기본 개념 확인
- 난이도 3: 표준 수준
- 난이도 4-5: 심화 및 응용

채점 기준:
- 정확한 답 확인
- 풀이 과정 검토
- 오류가 발생한 단계 파악
- 건설적인 피드백 제공`;
  }

  async generateProblems(count: number = 5, difficulty?: number): Promise<Problem[]> {
    const unit = this.getUnitInfo();
    const difficultyText = difficulty
      ? `난이도 ${difficulty}`
      : '난이도 1-5를 골고루 섞어서';

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      system: this.getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `"${unit?.unitName}" 단원의 ${difficultyText} 문제를 ${count}개 생성해주세요.

문제 유형: 객관식, 단답형, 서술형을 적절히 섞어주세요.
학년: ${this.grade}학년 수준

각 문제는 다음 형식으로:
{
  "problems": [
    {
      "id": "고유ID",
      "difficulty": 1-5,
      "type": "객관식" | "단답형" | "서술형",
      "question": "문제 내용",
      "choices": ["선택지1", "선택지2", "선택지3", "선택지4"], // 객관식만
      "answer": "정답",
      "explanation": "상세한 해설",
      "steps": [
        {
          "stepNumber": 1,
          "description": "단계 설명",
          "expectedValue": "예상 값"
        }
      ]
    }
  ]
}

JSON 형식으로만 반환해주세요.`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const jsonMatch = content.text.match(/```json\s*([\s\S]*?)\s*```/) ||
                         content.text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
        const data = JSON.parse(jsonText);
        return data.problems;
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        return this.getDefaultProblems(count);
      }
    }

    return this.getDefaultProblems(count);
  }

  private getDefaultProblems(count: number): Problem[] {
    const unit = this.getUnitInfo();
    return Array.from({ length: count }, (_, i) => ({
      id: `problem-${i + 1}`,
      difficulty: Math.min(5, Math.ceil((i + 1) / 2)),
      type: '단답형' as const,
      question: `${unit?.unitName} 관련 문제 ${i + 1}`,
      answer: '답',
      explanation: '이 문제는 기본 개념을 확인하는 문제입니다.',
      steps: [
        { stepNumber: 1, description: '문제 파악', expectedValue: '조건 확인' },
        { stepNumber: 2, description: '풀이', expectedValue: '계산' },
        { stepNumber: 3, description: '답 확인', expectedValue: '검산' }
      ]
    }));
  }

  async checkAnswer(
    problem: Problem,
    userAnswer: string,
    userSteps?: string[]
  ): Promise<{
    isCorrect: boolean;
    feedback: string;
    wrongStep?: number;
    hint?: string;
  }> {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: this.getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `다음 문제에 대한 학생의 답을 채점해주세요:

문제: ${problem.question}
정답: ${problem.answer}
학생 답: ${userAnswer}
${userSteps ? `학생 풀이 과정: ${JSON.stringify(userSteps)}` : ''}

다음 형식으로 JSON으로 반환:
{
  "isCorrect": true/false,
  "feedback": "상세한 피드백 (격려 포함)",
  "wrongStep": 오답인 경우 틀린 단계 번호,
  "hint": "오답인 경우 힌트"
}

채점 기준:
- 답이 정확한가?
- 풀이 과정이 논리적인가?
- 어느 단계에서 실수했는가?

피드백은 ${this.grade}학년 학생이 이해하기 쉽게 작성해주세요.`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const jsonMatch = content.text.match(/```json\s*([\s\S]*?)\s*```/) ||
                         content.text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
        return JSON.parse(jsonText);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        // 기본 채점
        const isCorrect = userAnswer.trim().toLowerCase() === problem.answer.trim().toLowerCase();
        return {
          isCorrect,
          feedback: isCorrect
            ? '정답입니다! 잘했어요!'
            : `아쉽게도 틀렸습니다. 정답은 ${problem.answer}입니다. ${problem.explanation}`,
          wrongStep: isCorrect ? undefined : 1,
          hint: isCorrect ? undefined : '다시 한 번 차근차근 풀어보세요.'
        };
      }
    }

    return {
      isCorrect: false,
      feedback: '채점할 수 없습니다.',
    };
  }

  async getHint(problem: Problem): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: this.getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `다음 문제에 대한 힌트를 ${this.grade}학년 학생이 이해하기 쉽게 제공해주세요:

문제: ${problem.question}

힌트 조건:
- 답을 직접 알려주지 말 것
- 첫 번째 단계나 접근 방법만 안내
- 격려하는 톤으로 작성
- 2-3문장으로 간결하게`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return '문제를 다시 천천히 읽어보고, 무엇을 구하는 문제인지 생각해보세요.';
  }
}

// 에이전트 팩토리
export const createConceptAgent = (grade: number, unitId: string) => {
  return new ConceptLearningAgent(grade, unitId);
};

export const createProblemAgent = (grade: number, unitId: string) => {
  return new ProblemSolvingAgent(grade, unitId);
};

// 단원 정보 가져오기
export const getUnitsByGrade = (grade: number) => {
  return GRADE_UNITS[grade as keyof typeof GRADE_UNITS] || [];
};

export const getAllUnits = () => {
  const allUnits = [];
  for (const [grade, units] of Object.entries(GRADE_UNITS)) {
    allUnits.push(...units.map(unit => ({
      ...unit,
      grade: parseInt(grade),
      description: `${unit.unitName}의 개념과 문제를 학습합니다.`
    })));
  }
  return allUnits;
};
