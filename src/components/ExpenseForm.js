import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Expense.css';

const ExpenseTracker = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [expenses, setExpenses] = useState({});
  const [newExpense, setNewExpense] = useState({
    month: '',
    date: '',
    amount: '',
    category: '',
    description: '',
    salary: ''
  });

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || {};
    setExpenses(storedExpenses);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { month, date, amount, category, description, salary } = newExpense;
    
    const newExpenses = {
      ...expenses,
      [month]: {
        expenses: [...(expenses[month]?.expenses || []), { date, amount, category, description }],
        salary: salary || expenses[month]?.salary
      }
    };

    localStorage.setItem('expenses', JSON.stringify(newExpenses));
    setExpenses(newExpenses);
    
    setNewExpense({
      month: '',
      date: '',
      amount: '',
      category: '',
      description: '',
      salary: ''
    });
  };

  const handleMonthChange = (e) => {
    const { value } = e.target;
    setNewExpense({ ...newExpense, month: value, salary: expenses[value]?.salary || '' });
  };

  const handleDeleteExpense = (month, index) => {
    const updatedExpenses = { ...expenses };
    updatedExpenses[month].expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const calculateSavings = (monthExpenses, salary) => {
    const totalExpenses = monthExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    return isNaN(salary) ? '-' : (salary - totalExpenses).toFixed(2);
  };

  const calculateTotalSavings = () => {
    let total = 0;
    Object.values(expenses).forEach(({ expenses, salary }) => {
      const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      total += isNaN(salary) ? 0 : salary - totalExpenses;
    });
    return total.toFixed(2);
  };

  // Gather all expenses grouped by month
  const allExpenses = Object.entries(expenses).flatMap(([month, { expenses: monthExpenses, salary }]) => {
    return monthExpenses.map((expense, index) => ({
      month,
      salary,
      ...expense
    }));
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          {/* Expense Tracker Form */}
          <div>
            <h2 className="mt-4 mb-3">Expense Tracker</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <select className="form-select" name="month" value={newExpense.month} onChange={handleMonthChange}>
                  <option value="">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <input type="date" className="form-control" name="date" value={newExpense.date} onChange={handleInputChange} placeholder="Date"  required/>
              </div>
              <div className="mb-3">
                <input type="number" className="form-control" name="salary" value={newExpense.salary} onChange={handleInputChange} placeholder="Salary" required/>
              </div>
              <div className="mb-3">
                <input type="number" className="form-control" name="amount" value={newExpense.amount} onChange={handleInputChange} placeholder="Amount" required/>
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" name="category" value={newExpense.category} onChange={handleInputChange} placeholder="Category" required/>
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" name="description" value={newExpense.description} onChange={handleInputChange} placeholder="Description" required/>
              </div>
              
              <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          {/* Total Savings Display */}
          <div>
            <h2 className="mt-4 mb-3">Total Savings</h2>
            <p>{calculateTotalSavings()}</p>
          </div>

          {/* All Expenses Display */}
          <div>
            <h2 className="mt-4 mb-3">All Expenses</h2>
            {allExpenses.map((expense, index) => (
              <div key={index}>
                <h3>{expense.month}</h3>
                <p>Salary: {isNaN(expense.salary) ? '-' : expense.salary}</p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{expense.date}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>{expense.description}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteExpense(expense.month, index)}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>Savings: {calculateSavings([expense], expense.salary)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
