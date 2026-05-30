import Boom from '@hapi/boom';
import { Response, NextFunction } from 'express';
import { getExpensesByUserService, getExpensesByTripService, createExpenseService, deleteExpenseService } from './expenses.service';
import { AuthRequest } from '../../shared/types';

export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.query;
    let expenses;
    if (tripId && typeof tripId === 'string') {
      expenses = await getExpensesByTripService(tripId, req.user!.id);
    } else {
      expenses = await getExpensesByUserService(req.user!.id);
    }
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, category, date, notes, trip_id } = req.body;

    if (!amount || !category || !date) {
      return next(Boom.badRequest('Missing required fields: amount, category, date'));
    }

    const expense = await createExpenseService(req.user!.id, {
      amount: Number(amount),
      category,
      date,
      notes,
      trip_id: trip_id ?? null,
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteExpenseService(id, req.user!.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};
