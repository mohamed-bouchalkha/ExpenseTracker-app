const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
  targetDate: { type: Date, required: true }, // Date de l'objectif (jour, mois, année)
  amount: { type: Number, required: true }, // Montant limite pour cet objectif
});

module.exports = mongoose.model('Goal', goalSchema);
