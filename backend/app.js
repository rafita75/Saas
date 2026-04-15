import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './src/core/routes/index.js';
import { errorHandler, notFound } from './src/core/middleware/error.middleware.js';
import { tenantResolver } from './src/core/middleware/tenant.middleware.js';

dotenv.config();

const app = express();

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
    
    // Permitir subdominios de jgsystemsgt.com
    if (origin.endsWith('.jgsystemsgt.com') || origin === 'https://jgsystemsgt.com') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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