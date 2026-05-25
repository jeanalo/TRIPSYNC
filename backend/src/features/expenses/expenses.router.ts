import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from './expenses.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, getExpenses as any);
router.post('/', authMiddleware as any, createExpense as any);
router.delete('/:id', authMiddleware as any, deleteExpense as any);

export const expensesRouter = router;
