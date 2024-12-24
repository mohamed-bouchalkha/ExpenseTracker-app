  const mongoose = require('mongoose');

  const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Référence à la catégorie
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
  });

  module.exports = mongoose.model('Expense', expenseSchema);
