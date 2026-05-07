import { Router } from 'express';
import { getExpenses, deleteExpense } from './expenses.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, getExpenses);
router.delete('/:id', authMiddleware as any, deleteExpense);

export const expensesRouter = router;
