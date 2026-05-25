import { Router } from 'express';
import { getAdminTrips, getAdminUsers } from './admin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = Router();

router.get('/trips', authMiddleware as any, adminMiddleware as any, getAdminTrips as any);
router.get('/users', authMiddleware as any, adminMiddleware as any, getAdminUsers as any);

export const adminRouter = router;
