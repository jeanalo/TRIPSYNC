import { Expense } from './expenses.types';

let expensesMock: Expense[] = [
  { id: "1", amount: 150, category: "Food", date: "2026-06-02" }
];

export const getExpensesService = (): Expense[] => {
  return expensesMock;
};

export const deleteExpenseService = (id: string): boolean => {
  const initialLength = expensesMock.length;
  expensesMock = expensesMock.filter(e => e.id !== id);
  return expensesMock.length < initialLength;
};
