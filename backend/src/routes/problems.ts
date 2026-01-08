import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// 문제 조회 (필터링)
router.get('/', async (req, res) => {
  try {
    const { unitId, conceptId, difficulty, limit } = req.query;

    const where: any = { verificationStatus: true };
    if (unitId) where.unitId = unitId as string;
    if (conceptId) where.conceptId = conceptId as string;
    if (difficulty) where.difficulty = parseInt(difficulty as string);

    const problems = await prisma.problem.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      include: {
        unit: true,
        concept: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(problems);
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ error: '문제 조회 중 오류가 발생했습니다' });
  }
});

// 특정 문제 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        unit: true,
        concept: true,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: '문제를 찾을 수 없습니다' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ error: '문제 조회 중 오류가 발생했습니다' });
  }
});

// 문제 제출 및 채점
const submitSchema = z.object({
  answer: z.string(),
  steps: z.array(z.any()).optional(),
  timeSpent: z.number().int().min(0),
});

router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { answer, steps, timeSpent } = submitSchema.parse(req.body);

    // 문제 가져오기
    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({ error: '문제를 찾을 수 없습니다' });
    }

    // 정답 확인
    const isCorrect = answer.trim().toLowerCase() === problem.answer.trim().toLowerCase();

    // 틀린 단계 찾기 (단계별 풀이가 있는 경우)
    let wrongStep = null;
    if (!isCorrect && steps && Array.isArray(steps)) {
      const problemSteps = problem.steps as any[];
      for (let i = 0; i < Math.min(steps.length, problemSteps.length); i++) {
        if (JSON.stringify(steps[i]) !== JSON.stringify(problemSteps[i])) {
          wrongStep = i + 1;
          break;
        }
      }
    }

    // 이전 시도 횟수 확인
    const previousAttempts = await prisma.problemAttempt.count({
      where: {
        userId,
        problemId: id,
      },
    });

    // 문제 풀이 기록 저장
    const attempt = await prisma.problemAttempt.create({
      data: {
        userId,
        problemId: id,
        attemptNumber: previousAttempts + 1,
        userAnswer: answer,
        userSteps: steps || [],
        isCorrect,
        wrongStep,
        timeSpent,
      },
    });

    // 틀린 경우 오답노트 생성
    if (!isCorrect) {
      await prisma.wrongAnswerNote.create({
        data: {
          userId,
          problemAttemptId: attempt.id,
          analysis: wrongStep
            ? `${wrongStep}번째 단계에서 오류가 발생했습니다.`
            : '최종 답이 올바르지 않습니다.',
          correctSteps: problem.steps,
        },
      });
    }

    // 성취도 업데이트
    await updateAchievement(userId, problem.unitId);

    res.json({
      isCorrect,
      wrongStep,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      attemptId: attempt.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Submit problem error:', error);
    res.status(500).json({ error: '문제 제출 중 오류가 발생했습니다' });
  }
});

// 추천 문제 가져오기 (취약 개념 기반)
router.get('/recommend/:unitId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { unitId } = req.params;
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 10;

    // 사용자의 성취도 조회
    const achievement = await prisma.achievement.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId,
        },
      },
    });

    let problems;

    if (achievement && achievement.weakConcepts) {
      // 취약 개념 기반 문제 추천
      const weakConceptIds = achievement.weakConcepts as string[];
      problems = await prisma.problem.findMany({
        where: {
          unitId,
          conceptId: { in: weakConceptIds },
          verificationStatus: true,
        },
        take: limit,
        orderBy: { difficulty: 'asc' },
      });
    } else {
      // 기본 문제 추천
      problems = await prisma.problem.findMany({
        where: {
          unitId,
          verificationStatus: true,
        },
        take: limit,
        orderBy: { difficulty: 'asc' },
      });
    }

    res.json(problems);
  } catch (error) {
    console.error('Recommend problems error:', error);
    res.status(500).json({ error: '문제 추천 중 오류가 발생했습니다' });
  }
});

// 성취도 업데이트 헬퍼 함수
async function updateAchievement(userId: string, unitId: string) {
  // 해당 단원의 모든 시도 가져오기
  const attempts = await prisma.problemAttempt.findMany({
    where: {
      userId,
      problem: { unitId },
    },
    include: {
      problem: true,
    },
  });

  if (attempts.length === 0) return;

  // 정확도 계산
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const accuracy = (correctAttempts / attempts.length) * 100;

  // 평균 시간 계산
  const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0);
  const averageTime = totalTime / attempts.length;

  // 취약 개념 찾기
  const conceptAccuracy: { [key: string]: { correct: number; total: number } } = {};

  attempts.forEach(attempt => {
    const conceptId = attempt.problem.conceptId;
    if (!conceptAccuracy[conceptId]) {
      conceptAccuracy[conceptId] = { correct: 0, total: 0 };
    }
    conceptAccuracy[conceptId].total++;
    if (attempt.isCorrect) {
      conceptAccuracy[conceptId].correct++;
    }
  });

  const weakConcepts = Object.entries(conceptAccuracy)
    .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
    .map(([conceptId]) => conceptId);

  // 성취도 업데이트
  await prisma.achievement.upsert({
    where: {
      userId_unitId: {
        userId,
        unitId,
      },
    },
    update: {
      accuracy,
      problemsSolved: attempts.length,
      averageTime,
      weakConcepts,
    },
    create: {
      userId,
      unitId,
      accuracy,
      problemsSolved: attempts.length,
      averageTime,
      weakConcepts,
    },
  });
}

export default router;
