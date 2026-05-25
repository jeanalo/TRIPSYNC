import { Router } from 'express';
import { getAdminTrips, getAdminUsers } from './admin.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const router = Router();

router.get('/trips', authMiddleware as any, adminMiddleware as any, getAdminTrips as any);
router.get('/users', authMiddleware as any, adminMiddleware as any, getAdminUsers as any);

export const adminRouter = router;
