const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  totalSpent: { type: Number, required: true },
  expensesByCategory: { 
    type: Map, 
    of: Number // Une clé de catégorie mappée à un montant total
  }
});

module.exports = mongoose.model('Statistics', statisticsSchema);
