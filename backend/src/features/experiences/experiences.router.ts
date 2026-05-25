import { Router, RequestHandler } from 'express';
import { getExperiences, createExperience } from './experiences.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

router.get('/', getExperiences);
router.post('/', authMiddleware as RequestHandler, requireRole('admin') as RequestHandler, createExperience as RequestHandler);

export const experiencesRouter = router;
