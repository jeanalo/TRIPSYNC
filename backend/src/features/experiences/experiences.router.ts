import { Router } from 'express';
import { getExperiences, createExperience } from './experiences.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

router.get('/', getExperiences);
router.post('/', authMiddleware as any, requireRole('admin') as any, createExperience);

export const experiencesRouter = router;
