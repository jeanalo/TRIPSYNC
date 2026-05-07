import { Request, Response } from 'express';
import { getExpensesService, deleteExpenseService } from './expenses.service';

export const getExpenses = (req: Request, res: Response) => {
  const expenses = getExpensesService();
  res.json(expenses);
};

export const deleteExpense = (req: Request, res: Response) => {
  const { id } = req.params;
  const success = deleteExpenseService(id);
  
  if (!success) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  
  res.json({ message: 'Expense deleted' });
};
