import { Router, RequestHandler } from 'express';
import { getExpenses, createExpense, deleteExpense } from './expenses.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware as RequestHandler, getExpenses as RequestHandler);
router.post('/', authMiddleware as RequestHandler, createExpense as RequestHandler);
router.delete('/:id', authMiddleware as RequestHandler, deleteExpense as RequestHandler);

export const expensesRouter = router;
