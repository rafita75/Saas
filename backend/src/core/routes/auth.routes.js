import { Router } from 'express';
import { authLimiter } from '../middleware/rate-limit.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { register, login, logout, logoutAll, me } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = Router();

// Rutas públicas (con rate limiting)
router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);

// Rutas protegidas
router.post('/logout', authMiddleware, logout);
router.post('/logout-all', authMiddleware, logoutAll);
router.get('/me', authMiddleware, me);

export default router;