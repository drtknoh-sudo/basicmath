import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 특정 개념 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const concept = await prisma.concept.findUnique({
      where: { id },
      include: {
        unit: true,
      },
    });

    if (!concept) {
      return res.status(404).json({ error: '개념을 찾을 수 없습니다' });
    }

    res.json(concept);
  } catch (error) {
    console.error('Get concept error:', error);
    res.status(500).json({ error: '개념 조회 중 오류가 발생했습니다' });
  }
});

// 단원별 개념 목록 조회
router.get('/unit/:unitId', async (req, res) => {
  try {
    const { unitId } = req.params;

    const concepts = await prisma.concept.findMany({
      where: { unitId },
      orderBy: { conceptNumber: 'asc' },
    });

    res.json(concepts);
  } catch (error) {
    console.error('Get concepts error:', error);
    res.status(500).json({ error: '개념 목록 조회 중 오류가 발생했습니다' });
  }
});

export default router;
