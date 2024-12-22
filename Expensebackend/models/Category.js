const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // Unicité sur le nom de la catégorie
});

module.exports = mongoose.model('Category', categorySchema);
