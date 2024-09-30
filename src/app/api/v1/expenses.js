import dbConnect from '../../lib/mongodb';
import Expense from '../../models/Expense';

export default async function handler(req, res) {
  await dbConnect(); // ตรวจสอบว่าการเชื่อมต่อทำงาน

  if (req.method === 'POST') {
    try {
      const expense = new Expense(req.body);
      await expense.save(); // ตรวจสอบว่าบันทึกได้สำเร็จ
      res.status(201).json(expense);
    } catch (error) {
      console.error('Error saving expense:', error); // เพิ่มการแสดงข้อผิดพลาดใน console
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const expenses = await Expense.find({});
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
