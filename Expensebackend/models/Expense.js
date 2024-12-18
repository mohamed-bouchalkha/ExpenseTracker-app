const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseId: { type: Number, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  categoryId: { type: Number, required: true },
  userId: { type: Number, required: true, ref: 'User' } // Référence vers le modèle User
});

module.exports = mongoose.model('Expense', expenseSchema);
