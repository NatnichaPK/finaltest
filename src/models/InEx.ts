import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true }, // คุณอาจจะเปลี่ยนเป็น Date ได้
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: { type: String, required: false },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
