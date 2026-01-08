import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  name: z.string().min(2),
  grade: z.number().int().min(1).max(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, grade } = registerSchema.parse(req.body);

    // 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자명입니다' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        grade,
      },
    });

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        grade: user.grade,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        grade: user.grade,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다' });
  }
});

export default router;
