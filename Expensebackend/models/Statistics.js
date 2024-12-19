const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
  totalSpent: { type: Number, default: 0 },
  expensesByCategory: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Catégorie
      totalAmount: { type: Number, default: 0 }, // Montant total pour cette catégorie
    },
  ],
  allExpenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], // Référence à toutes les dépenses associées
});

module.exports = mongoose.model('Statistics', statisticsSchema);
