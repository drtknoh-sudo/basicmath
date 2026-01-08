import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 사용자의 전체 성취도 조회
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      include: {
        unit: true,
      },
      orderBy: [
        { unit: { grade: 'asc' } },
        { unit: { semester: 'asc' } },
        { unit: { unitNumber: 'asc' } },
      ],
    });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: '성취도 조회 중 오류가 발생했습니다' });
  }
});

// 특정 단원의 성취도 조회
router.get('/unit/:unitId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { unitId } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId,
        },
      },
      include: {
        unit: true,
      },
    });

    if (!achievement) {
      return res.status(404).json({ error: '성취도 정보를 찾을 수 없습니다' });
    }

    // 취약 개념 상세 정보 가져오기
    const weakConceptIds = achievement.weakConcepts as string[];
    const weakConceptDetails = await prisma.concept.findMany({
      where: {
        id: { in: weakConceptIds },
      },
    });

    res.json({
      ...achievement,
      weakConceptDetails,
    });
  } catch (error) {
    console.error('Get unit achievement error:', error);
    res.status(500).json({ error: '단원 성취도 조회 중 오류가 발생했습니다' });
  }
});

// 학습 통계 조회
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // 전체 문제 풀이 수
    const totalAttempts = await prisma.problemAttempt.count({
      where: { userId },
    });

    // 정답 수
    const correctAttempts = await prisma.problemAttempt.count({
      where: { userId, isCorrect: true },
    });

    // 전체 정확도
    const overallAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // 총 학습 시간
    const learningRecords = await prisma.learningRecord.findMany({
      where: { userId, completed: true },
    });
    const totalLearningTime = learningRecords.reduce((sum, r) => sum + r.duration, 0);

    // 완료한 단원 수
    const completedUnits = await prisma.learningRecord.groupBy({
      by: ['unitId'],
      where: { userId, completed: true },
    });

    // 마스터한 오답 수
    const masteredWrongAnswers = await prisma.wrongAnswerNote.count({
      where: { userId, mastered: true },
    });

    // 전체 오답 수
    const totalWrongAnswers = await prisma.wrongAnswerNote.count({
      where: { userId },
    });

    // 최근 7일간 활동
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttempts = await prisma.problemAttempt.count({
      where: {
        userId,
        attemptedAt: { gte: sevenDaysAgo },
      },
    });

    res.json({
      totalAttempts,
      correctAttempts,
      overallAccuracy: Math.round(overallAccuracy * 100) / 100,
      totalLearningTime,
      completedUnits: completedUnits.length,
      masteredWrongAnswers,
      totalWrongAnswers,
      recentAttempts,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다' });
  }
});

export default router;
