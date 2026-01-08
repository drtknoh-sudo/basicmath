import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 모든 단원 조회
router.get('/', async (req, res) => {
  try {
    const { grade, semester, category } = req.query;

    const where: any = {};
    if (grade) where.grade = parseInt(grade as string);
    if (semester) where.semester = parseInt(semester as string);
    if (category) where.category = category as string;

    const units = await prisma.unit.findMany({
      where,
      orderBy: [
        { grade: 'asc' },
        { semester: 'asc' },
        { unitNumber: 'asc' },
      ],
    });

    res.json(units);
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({ error: '단원 조회 중 오류가 발생했습니다' });
  }
});

// 특정 단원 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        concepts: {
          orderBy: { conceptNumber: 'asc' },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ error: '단원을 찾을 수 없습니다' });
    }

    res.json(unit);
  } catch (error) {
    console.error('Get unit error:', error);
    res.status(500).json({ error: '단원 조회 중 오류가 발생했습니다' });
  }
});

// 단원별 학습 진도 조회
router.get('/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // 해당 단원의 모든 개념 가져오기
    const concepts = await prisma.concept.findMany({
      where: { unitId: id },
    });

    // 사용자의 학습 기록 가져오기
    const learningRecords = await prisma.learningRecord.findMany({
      where: {
        userId,
        unitId: id,
      },
    });

    // 진도율 계산
    const totalConcepts = concepts.length;
    const completedConcepts = learningRecords.filter(r => r.completed).length;
    const progress = totalConcepts > 0 ? (completedConcepts / totalConcepts) * 100 : 0;

    res.json({
      unitId: id,
      totalConcepts,
      completedConcepts,
      progress: Math.round(progress * 100) / 100,
    });
  } catch (error) {
    console.error('Get unit progress error:', error);
    res.status(500).json({ error: '진도 조회 중 오류가 발생했습니다' });
  }
});

export default router;
