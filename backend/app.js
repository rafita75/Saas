import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { supabaseAnon } from './src/core/database/supabase.js';

dotenv.config();

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Health check - Verifica conexión a Supabase
app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabaseAnon.from('tenants').select('count').limit(1);
    
    if (error) {
      // Si la tabla no existe aún, igual respondemos ok pero con warning
      return res.json({ 
        status: 'ok', 
        supabase: 'connected (tables pending)',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({ 
      status: 'ok', 
      supabase: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});