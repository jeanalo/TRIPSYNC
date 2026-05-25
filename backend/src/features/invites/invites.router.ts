import { Router } from 'express';
import { createInvite, getInviteInfo, joinTrip } from './invites.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/trips/:tripId/invite  — owner generates invite token
router.post('/:tripId/invite', authMiddleware as any, createInvite as any);

// GET  /api/trips/join?token=     — public, returns trip info
router.get('/join', getInviteInfo as any);

// POST /api/trips/join            — authenticated, joins the trip
router.post('/join', authMiddleware as any, joinTrip as any);

export const invitesRouter = router;
