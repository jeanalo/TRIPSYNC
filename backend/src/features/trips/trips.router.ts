import { Router } from 'express';
import { getTrips, updateBudget, updateCountries } from './trips.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, getTrips);
router.patch('/:id/budget', authMiddleware as any, updateBudget);
router.patch('/:id/countries', authMiddleware as any, updateCountries);

export const tripsRouter = router;
