import { Router, RequestHandler } from 'express';
import { getMyTrip, upsertTrip } from './trips.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { invitesRouter } from '../invites/invites.router';

const router = Router();

router.get('/me', authMiddleware as RequestHandler, getMyTrip as RequestHandler);
router.put('/me', authMiddleware as RequestHandler, upsertTrip as RequestHandler);
router.use('/', invitesRouter);

export const tripsRouter = router;
