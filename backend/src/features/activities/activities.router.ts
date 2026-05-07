import { Router } from 'express';
import { getActivities, deleteActivity } from './activities.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, getActivities);
router.delete('/:id', authMiddleware as any, deleteActivity);

export const activitiesRouter = router;
