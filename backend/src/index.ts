import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import unitRoutes from './routes/units';
import conceptRoutes from './routes/concepts';
import problemRoutes from './routes/problems';
import learningRoutes from './routes/learning';
import achievementRoutes from './routes/achievements';
import goalRoutes from './routes/goals';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all Vercel preview URLs
    if (origin.includes('vercel.app')) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/goals', goalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
