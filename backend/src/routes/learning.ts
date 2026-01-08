import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// 학습 시작
const startLearningSchema = z.object({
  unitId: z.string(),
  conceptId: z.string(),
});

router.post('/start', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { unitId, conceptId } = startLearningSchema.parse(req.body);

    const learningRecord = await prisma.learningRecord.create({
      data: {
        userId,
        unitId,
        conceptId,
        duration: 0,
      },
    });

    res.json(learningRecord);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Start learning error:', error);
    res.status(500).json({ error: '학습 시작 중 오류가 발생했습니다' });
  }
});

// 학습 완료
const completeLearningSchema = z.object({
  learningRecordId: z.string(),
  duration: z.number().int().min(0),
});

router.post('/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { learningRecordId, duration } = completeLearningSchema.parse(req.body);

    // 학습 기록 확인
    const learningRecord = await prisma.learningRecord.findUnique({
      where: { id: learningRecordId },
    });

    if (!learningRecord || learningRecord.userId !== userId) {
      return res.status(404).json({ error: '학습 기록을 찾을 수 없습니다' });
    }

    // 학습 완료 처리
    const updatedRecord = await prisma.learningRecord.update({
      where: { id: learningRecordId },
      data: {
        duration,
        completed: true,
      },
    });

    res.json(updatedRecord);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Complete learning error:', error);
    res.status(500).json({ error: '학습 완료 처리 중 오류가 발생했습니다' });
  }
});

// 학습 기록 조회
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { unitId, limit } = req.query;

    const where: any = { userId };
    if (unitId) where.unitId = unitId as string;

    const learningRecords = await prisma.learningRecord.findMany({
      where,
      include: {
        unit: true,
        concept: true,
      },
      orderBy: { studiedAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });

    res.json(learningRecords);
  } catch (error) {
    console.error('Get learning history error:', error);
    res.status(500).json({ error: '학습 기록 조회 중 오류가 발생했습니다' });
  }
});

// 오답노트 조회
router.get('/wrong-answers', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { mastered, limit } = req.query;

    const where: any = { userId };
    if (mastered !== undefined) {
      where.mastered = mastered === 'true';
    }

    const wrongAnswerNotes = await prisma.wrongAnswerNote.findMany({
      where,
      include: {
        problemAttempt: {
          include: {
            problem: {
              include: {
                unit: true,
                concept: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });

    res.json(wrongAnswerNotes);
  } catch (error) {
    console.error('Get wrong answers error:', error);
    res.status(500).json({ error: '오답노트 조회 중 오류가 발생했습니다' });
  }
});

// 오답 복습 완료
router.patch('/wrong-answers/:id/review', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { mastered } = req.body;

    const wrongAnswerNote = await prisma.wrongAnswerNote.findUnique({
      where: { id },
    });

    if (!wrongAnswerNote || wrongAnswerNote.userId !== userId) {
      return res.status(404).json({ error: '오답노트를 찾을 수 없습니다' });
    }

    const updated = await prisma.wrongAnswerNote.update({
      where: { id },
      data: {
        reviewedAt: new Date(),
        mastered: mastered || false,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Review wrong answer error:', error);
    res.status(500).json({ error: '오답 복습 처리 중 오류가 발생했습니다' });
  }
});

export default router;
