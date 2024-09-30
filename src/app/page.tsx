"use client"; // ระบุว่าเป็น Client Component

import { useState, useEffect } from 'react';

interface Expense {
  amount: number;
  date: string;
  type: string;
  note: string;
}

export default function Home() {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<string>('income'); // income or expense
  const [note, setNote] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    console.log(data); // ตรวจสอบข้อมูลที่ได้รับ
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses(); // ดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newExpense: Expense = {
      amount: parseFloat(amount),
      date,
      type,
      note,
    };

    if (isNaN(newExpense.amount) || newExpense.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // ส่งข้อมูลไปยัง API
    await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExpense),
    });

    fetchExpenses(); // เรียกใช้เพื่อดึงข้อมูลใหม่

    // รีเซ็ตค่าต่าง ๆ ใน form
    setAmount('');
    setDate('');
    setType('income');
    setNote('');
  };

  // คำนวณยอดรวม
  const totalIncome = expenses
    .filter(expense => expense.type === 'income')
    .reduce((acc, expense) => acc + expense.amount, 0);
  
  const totalExpense = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((acc, expense) => acc + expense.amount, 0);
  
  const netTotal = totalIncome - totalExpense;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Expense Tracker</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
          style={inputStyle} 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          style={inputStyle} 
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <textarea 
          placeholder="Note" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          style={textareaStyle}
        />
        <button type="submit" style={buttonStyle}>Add</button>
      </form>

      <div style={summaryStyle}>
        <h2 style={summaryTitleStyle}>Summary</h2>
        <p style={summaryItemStyle}>Total Income: <span style={incomeStyle}>${totalIncome.toLocaleString()}</span></p>
        <p style={summaryItemStyle}>Total Expense: <span style={expenseStyle}>${totalExpense.toLocaleString()}</span></p>
        <p style={summaryItemStyle}>Net Total: <span style={netStyle}>{netTotal.toLocaleString()}</span></p>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Type</th>
            <th style={tableHeaderStyle}>Amount</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Note</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{expense.type === 'income' ? '+' : '-'}</td>
              <td style={tableCellStyle}>${expense.amount.toLocaleString()}</td>
              <td style={tableCellStyle}>{expense.date}</td>
              <td style={tableCellStyle}>{expense.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const selectStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const textareaStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  height: '100px',
};

const buttonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
};

const summaryStyle = {
  margin: '20px 0',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const summaryTitleStyle = {
  margin: 0,
};

const summaryItemStyle = {
  margin: '5px 0',
};

const incomeStyle = {
  color: 'green',
};

const expenseStyle = {
  color: 'red',
};

const netStyle = {
  fontWeight: 'bold',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const tableHeaderStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  textAlign: 'left',
};

const tableCellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
};
