export interface Expense {
  id: string;
  user_id: string;
  trip_id?: string | null;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface CreateExpenseRequest {
  trip_id?: string | null;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}
