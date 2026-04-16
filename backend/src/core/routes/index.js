import { Router } from 'express';
import authRoutes from './auth.routes.js';
import tenantRoutes from './tenant.routes.js';
import userRoutes from './user.routes.js';
import moduleRoutes from './module.routes.js';
import landingRoutes from '../../modules/landing-page/landing.routes.js';

const router = Router();

// Rutas públicas y protegidas
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);
router.use('/modules', moduleRoutes);
router.use('/landings', landingRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;