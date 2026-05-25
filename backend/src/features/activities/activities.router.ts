import { Router } from 'express';
import { getActivities, createActivity, deleteActivity } from './activities.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as any, getActivities as any);
router.post('/', authMiddleware as any, createActivity as any);
router.delete('/:id', authMiddleware as any, deleteActivity as any);

export const activitiesRouter = router;
