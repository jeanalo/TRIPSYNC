import { Router } from 'express';
import { authRouter } from '../features/auth/auth.router';
import { usersRouter } from '../features/users/users.router';
import { tripsRouter } from '../features/trips/trips.router';
import { expensesRouter } from '../features/expenses/expenses.router';
import { activitiesRouter } from '../features/activities/activities.router';
import { experiencesRouter } from '../features/experiences/experiences.router';
import { jetlagRouter } from '../features/jetlag/jetlag.router';
import { adminRouter } from '../features/admin/admin.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/trips', tripsRouter);
router.use('/expenses', expensesRouter);
router.use('/activities', activitiesRouter);
router.use('/experiences', experiencesRouter);
router.use('/jetlag', jetlagRouter);
router.use('/admin', adminRouter);

export const apiRouter = router;
