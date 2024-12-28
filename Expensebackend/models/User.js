const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null }, // Code de vérification
  codeExpiresAt: { type: Date, default: null }, // Date d'expiration du code
  codereset: { type: String, default: null }, // Code de réinitialisation
  isVerifiedCodeReset: { type: Boolean, default: false }, // Vérification du code de réinitialisation
  codeResetExpiresAt: { type: Date, default: null }, // Expiration du code de réinitialisation
});

// Hash du mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
