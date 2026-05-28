import { Router, RequestHandler } from 'express';
import { createInvite, getInviteInfo, joinTrip } from './invites.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// POST /api/trips/:tripId/invite  — owner generates invite token
router.post('/:tripId/invite', authMiddleware as RequestHandler, createInvite as RequestHandler);

// GET  /api/trips/join?token=     — public, returns trip info
router.get('/join', getInviteInfo as RequestHandler);

// POST /api/trips/join            — authenticated, joins the trip
router.post('/join', authMiddleware as RequestHandler, joinTrip as RequestHandler);

export const invitesRouter = router;
