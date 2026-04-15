import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/user.controller.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.post('/change-password', changePassword);

export default router;