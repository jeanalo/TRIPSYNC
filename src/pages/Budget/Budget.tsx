import { useTravel } from '../../context/TravelContext';
import { Link } from 'react-router-dom';

const Budget = () => {
  const { tripDetails, expenses } = useTravel();

  const totalBudget = Number(tripDetails.budget) || 0;
  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div>
      <h1>Budget Tracker</h1>
      <p>Keep your finances in check while you explore.</p>

      <Link to="/app/budget/add">+ Add Expense</Link>

      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
        <div
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            minWidth: '150px',
          }}
        >
          <p>Total Budget</p>
          <h2>${totalBudget.toFixed(2)}</h2>
        </div>
        <div
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            minWidth: '150px',
          }}
        >
          <p>Spent</p>
          <h2>${totalSpent.toFixed(2)}</h2>
        </div>
        <div
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            minWidth: '150px',
          }}
        >
          <p>Remaining</p>
          <h2 style={{ color: remaining < 0 ? 'red' : 'green' }}>
            ${remaining.toFixed(2)}
          </h2>
        </div>
      </div>

      <h3 style={{ marginTop: '32px' }}>Recent Transactions</h3>
      {expenses.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenses.map((expense) => (
            <li
              key={expense.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                borderBottom: '1px solid #eee',
              }}
            >
              <div>
                <strong>{expense.category}</strong>
                <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                  {expense.notes || 'No notes'} • {expense.date}
                </p>
              </div>
              <span>-${(Number(expense.amount) || 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions recorded yet.</p>
      )}
    </div>
  );
};

export default Budget;
