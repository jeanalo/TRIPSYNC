import { Router, RequestHandler } from 'express';
import { getAdminTrips, getAdminUsers } from './admin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

router.get('/trips', authMiddleware as RequestHandler, requireRole('admin') as RequestHandler, getAdminTrips as RequestHandler);
router.get('/users', authMiddleware as RequestHandler, requireRole('admin') as RequestHandler, getAdminUsers as RequestHandler);

export const adminRouter = router;
