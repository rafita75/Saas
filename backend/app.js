import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { 
  authLimiter, 
  apiLimiter, 
  webhookLimiter, 
  uploadLimiter 
} from './src/core/middleware/rate-limit.js';

dotenv.config();

const app = express();

// CORS para aceptar subdominios
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://jgsystemsgt.com',
    'https://*.jgsystemsgt.com',
    /\.tudominio\.com$/
  ],
  credentials: true
}));

app.use(helmet());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabase: !!process.env.SUPABASE_URL
  });
});

// API test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});