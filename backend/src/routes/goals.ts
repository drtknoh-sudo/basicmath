import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// 목표 생성
const createGoalSchema = z.object({
  unitId: z.string(),
  targetScore: z.number().int().min(0).max(100),
  targetDate: z.string().datetime(),
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { unitId, targetScore, targetDate } = createGoalSchema.parse(req.body);

    const goal = await prisma.goal.create({
      data: {
        userId,
        unitId,
        targetScore,
        targetDate: new Date(targetDate),
      },
      include: {
        unit: true,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Create goal error:', error);
    res.status(500).json({ error: '목표 생성 중 오류가 발생했습니다' });
  }
});

// 목표 목록 조회
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { achieved } = req.query;

    const where: any = { userId };
    if (achieved !== undefined) {
      where.achieved = achieved === 'true';
    }

    const goals = await prisma.goal.findMany({
      where,
      include: {
        unit: true,
      },
      orderBy: { targetDate: 'asc' },
    });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: '목표 조회 중 오류가 발생했습니다' });
  }
});

// 목표 진척도 업데이트
router.patch('/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: '목표를 찾을 수 없습니다' });
    }

    // 해당 단원의 최신 성취도 가져오기
    const achievement = await prisma.achievement.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId: goal.unitId,
        },
      },
    });

    const currentScore = achievement ? Math.round(achievement.accuracy) : 0;
    const achieved = currentScore >= goal.targetScore;

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        currentScore,
        achieved,
        achievedAt: achieved && !goal.achieved ? new Date() : goal.achievedAt,
      },
      include: {
        unit: true,
      },
    });

    res.json(updatedGoal);
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ error: '목표 진척도 업데이트 중 오류가 발생했습니다' });
  }
});

// 목표 삭제
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: '목표를 찾을 수 없습니다' });
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({ message: '목표가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: '목표 삭제 중 오류가 발생했습니다' });
  }
});

export default router;
