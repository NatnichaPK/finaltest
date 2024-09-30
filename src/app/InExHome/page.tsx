'use client'; 
import { useState, useEffect } from "react";

// Define the types
export type Record = {
  id?: number;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  note: string;
  userId: string; // เพิ่ม userId เพื่อเก็บข้อมูลผู้ใช้
};

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [newRecord, setNewRecord] = useState<Record>({
    amount: 0,
    date: "",
    type: "income",
    note: "",
    userId: "your-user-id", // ต้องใส่ userId ที่ถูกต้อง
  });
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // ดึงข้อมูลที่บันทึกไว้จากฐานข้อมูล
    fetch("/api/v1/records")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch records");
        }
        return res.json();
      })
      .then(data => {
        const fetchedRecords = data.data as Record[];
        setRecords(fetchedRecords);
        calculateTotals(fetchedRecords);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Error fetching records.");
      });
  }, []);

  const calculateTotals = (records: Record[]) => {
    let income = 0, expense = 0;
    records.forEach(record => {
      if (record.type === 'income') {
        income += record.amount;
      } else {
        expense += record.amount;
      }
    });
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  const handleAddRecord = () => {
    if (newRecord.amount > 0 && newRecord.date && newRecord.note.trim() && newRecord.userId) {
      fetch("/api/v1/records", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to add record");
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setRecords(prev => [...prev, data.data]);
          calculateTotals([...records, data.data]);
          setNewRecord({ amount: 0, date: "", type: "income", note: "", userId: newRecord.userId });
          setErrorMessage(null); // reset error message
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Failed to add record. Please try again.");
      });
    } else {
      setErrorMessage("Please fill in all fields correctly.");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Income/Expense Tracker</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="mb-4 flex space-x-4 items-center">
        <input
          type="number"
          className="border rounded p-2 w-1/6"
          placeholder="Amount"
          value={newRecord.amount}
          onChange={(e) => setNewRecord({ ...newRecord, amount: parseFloat(e.target.value) })}
        />
        <input
          type="date"
          className="border rounded p-2 w-1/6"
          value={newRecord.date}
          onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
        />
        <select
          className="border rounded p-2 w-1/6"
          value={newRecord.type}
          onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as 'income' | 'expense' })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <textarea
          className="border rounded p-2 w-1/3 h-[40px] resize-none"
          placeholder="Add note"
          value={newRecord.note}
          onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
        />
        <button onClick={handleAddRecord} className="bg-green-500 text-white p-2 rounded h-[40px] w-1/6">
          Add Record
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Totals</h2>
        <p>Total Income: {totalIncome} THB</p>
        <p>Total Expense: {totalExpense} THB</p>
        <p>Net Balance: {totalIncome - totalExpense} THB</p>
      </div>
      <ul>
        {records.map((record) => (
          <li key={record.id} className="flex items-center justify-between mb-2">
            <div>
              <span>{record.type === 'income' ? 'Income' : 'Expense'}: {record.amount} THB</span>
              <div className="text-gray-700 text-sm">{record.note}</div>
              <div className="text-gray-500 text-sm">{record.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
