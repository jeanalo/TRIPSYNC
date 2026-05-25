import { Router, RequestHandler } from 'express';
import { getActivities, createActivity, deleteActivity } from './activities.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as RequestHandler, getActivities as RequestHandler);
router.post('/', authMiddleware as RequestHandler, createActivity as RequestHandler);
router.delete('/:id', authMiddleware as RequestHandler, deleteActivity as RequestHandler);

export const activitiesRouter = router;
