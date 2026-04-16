import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { tenantResolver, validateTenantAccess } from '../middleware/tenant.middleware.js';
import { uploadLogo } from '../middleware/upload.middleware.js';
import {
  getMyTenants,
  getTenant,
  updateTenant,
  updatePublicSlug,
  updateLogo,
  inviteUser,
  getMembers,
  updateMemberRole,
  removeMember,
  completeOnboarding,
} from '../controllers/tenant.controller.js';

const router = Router();

// ✅ Ruta para completar onboarding (no requiere slug en URL)
router.post('/onboarding/complete', authMiddleware, completeOnboarding);

// Rutas que no requieren tenant específico
router.get('/', authMiddleware, getMyTenants);

// ✅ Orden correcto: auth → resolver → validar acceso
router.get('/:slug', authMiddleware, tenantResolver, validateTenantAccess, getTenant);
router.put('/:slug', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), updateTenant);
router.put('/:slug/public-slug', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), updatePublicSlug);
router.post('/:slug/logo', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), uploadLogo, updateLogo);
router.get('/:slug/members', authMiddleware, tenantResolver, validateTenantAccess, getMembers);
router.post('/:slug/invite', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), inviteUser);
router.put('/:slug/members/:userId', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner']), updateMemberRole);
router.delete('/:slug/members/:userId', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), removeMember);

export default router;