import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './core/database/mongodb.js';
import authRoutes from './modules/auth/auth.routes.js';

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://jgsystemsgt.com',
    'https://admin.jgsystemsgt.com',
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});