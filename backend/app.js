import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './src/core/routes/index.js';
import { errorHandler, notFound } from './src/core/middleware/error.middleware.js';
import { tenantResolver } from './src/core/middleware/tenant.middleware.js';

dotenv.config();

const app = express();

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://jgsystemsgt.com',
  'https://www.jgsystemsgt.com',
  'https://admin.jgsystemsgt.com',
];

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middlewares globales
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Regex para jgsystemsgt.com y sus subdominios
    const productionRegex = /^https?:\/\/(?:[a-z0-9-]+\.)?jgsystemsgt\.com$/;
    // Regex para localhost y sus subdominios
    const localRegex = /^https?:\/\/(?:[a-z0-9-]+\.)?localhost:5173$/;
    // Regex para Vercel (staging/prod)
    const vercelRegex = /^https?:\/\/.*\.vercel\.app$/;
    
    if (productionRegex.test(origin) || localRegex.test(origin) || vercelRegex.test(origin) || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(mongoSanitize());

// Middleware de tenant (intenta resolver el tenant por subdominio)
app.use(tenantResolver);

// API Routes
app.use('/api', routes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});

export default app;