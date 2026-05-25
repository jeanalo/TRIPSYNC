import { Response } from 'express';
import { getExpensesByUserService, createExpenseService, deleteExpenseService } from './expenses.service';
import { AuthRequest } from '../../shared/types';

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await getExpensesByUserService(req.user!.id);
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, date, notes, trip_id } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Missing required fields: amount, category, date' });
    }

    const expense = await createExpenseService(req.user!.id, {
      amount: Number(amount),
      category,
      date,
      notes,
      trip_id: trip_id ?? null,
    });
    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteExpenseService(id, req.user!.id);
    if (!success) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
