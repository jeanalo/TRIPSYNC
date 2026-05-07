import { Router } from 'express';
import { getExperiences, createExperience } from './experiences.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', getExperiences);
router.post('/', authMiddleware as any, requireRole('admin') as any, createExperience);

export const experiencesRouter = router;
