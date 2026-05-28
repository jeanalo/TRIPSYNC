import { Router, RequestHandler } from 'express';
import { getAdminTrips, getAdminUsers } from './admin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = Router();

router.get('/trips', authMiddleware as RequestHandler, adminMiddleware as RequestHandler, getAdminTrips as RequestHandler);
router.get('/users', authMiddleware as RequestHandler, adminMiddleware as RequestHandler, getAdminUsers as RequestHandler);

export const adminRouter = router;
