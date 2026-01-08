export interface User {
  id: string;
  username: string;
  name: string;
  grade: number;
}

export interface Unit {
  id: string;
  grade: number;
  semester: number;
  category: string;
  unitNumber: number;
  unitName: string;
  description: string;
  objectives: string[];
}

export interface Concept {
  id: string;
  unitId: string;
  conceptNumber: number;
  title: string;
  explanation: string;
  examples: Example[];
  visualAids?: VisualAid[];
}

export interface Example {
  question: string;
  solution: string;
  steps: string[];
}

export interface VisualAid {
  type: 'image' | 'diagram' | 'video';
  url: string;
  description: string;
}

export interface Problem {
  id: string;
  unitId: string;
  conceptId: string;
  difficulty: number;
  type: '객관식' | '단답형' | '서술형';
  question: string;
  steps: ProblemStep[];
  answer: string;
  explanation: string;
  choices?: string[];
}

export interface ProblemStep {
  stepNumber: number;
  description: string;
  expectedValue?: string;
}

export interface ProblemAttempt {
  id: string;
  userId: string;
  problemId: string;
  attemptNumber: number;
  userAnswer: string;
  userSteps?: any[];
  isCorrect: boolean;
  wrongStep?: number;
  timeSpent: number;
  attemptedAt: string;
}

export interface WrongAnswerNote {
  id: string;
  userId: string;
  problemAttemptId: string;
  analysis: string;
  correctSteps: ProblemStep[];
  reviewedAt?: string;
  mastered: boolean;
  problemAttempt: {
    problem: Problem;
  };
}

export interface Achievement {
  id: string;
  userId: string;
  unitId: string;
  accuracy: number;
  problemsSolved: number;
  averageTime: number;
  weakConcepts: string[];
  unit: Unit;
}

export interface Goal {
  id: string;
  userId: string;
  unitId: string;
  targetScore: number;
  currentScore: number;
  targetDate: string;
  achieved: boolean;
  achievedAt?: string;
  unit: Unit;
}

export interface Stats {
  totalAttempts: number;
  correctAttempts: number;
  overallAccuracy: number;
  totalLearningTime: number;
  completedUnits: number;
  masteredWrongAnswers: number;
  totalWrongAnswers: number;
  recentAttempts: number;
}
