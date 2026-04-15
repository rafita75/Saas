import { Router } from 'express';
import { authLimiter } from '../middleware/rate-limit.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  register,
  login,
  logout,
  logoutAll,
  me,
} from '../controllers/auth.controller.js';

const router = Router();

// Rutas públicas (con rate limiting)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Rutas protegidas
router.post('/logout', authMiddleware, logout);
router.post('/logout-all', authMiddleware, logoutAll);
router.get('/me', authMiddleware, me);

export default router;