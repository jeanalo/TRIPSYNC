import { Router } from 'express';
import { getMyTrip, upsertTrip } from './trips.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { invitesRouter } from '../invites/invites.router';

const router = Router();

router.get('/me', authMiddleware as any, getMyTrip as any);
router.put('/me', authMiddleware as any, upsertTrip as any);
router.use('/', invitesRouter);

export const tripsRouter = router;
