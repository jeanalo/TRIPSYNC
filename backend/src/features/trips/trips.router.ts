import { Router } from 'express';
import { getMyTrip, upsertTrip } from './trips.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware as any, getMyTrip as any);
router.put('/me', authMiddleware as any, upsertTrip as any);

export const tripsRouter = router;
