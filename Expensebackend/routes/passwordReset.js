const express = require('express');
const crypto = require('crypto');
const User = require('../models/User'); // Assurez-vous d'importer le modèle User
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Générer un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Définir la validité du code (par exemple, 1 heure)
    const codeExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Mettre à jour l'utilisateur avec le code et sa date d'expiration
    user.codereset = resetCode;
    user.codeResetExpiresAt = codeExpiresAt;
    user.isVerifiedCodeReset = false;
    await user.save();

    // Configurer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envoyer le code par email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `<p>Your password reset code is: <strong>${resetCode}</strong></p><p>This code is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset code sent successfully' });
  } catch (err) {
    console.error('Error sending reset code:', err);
    res.status(500).json({ message: 'Error sending reset code' });
  }
});



router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerifiedCodeReset) {
      return res.status(400).json({ message: 'Reset code not verified' });
    }

    // Réinitialiser le mot de passe
    user.password = password;
    user.codereset = null;
    user.codeResetExpiresAt = null;
    user.isVerifiedCodeReset = false;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});



router.post('/verify-reset-code', async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      codereset: code,
      codeResetExpiresAt: { $gte: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.codereset !== code || user.codeResetExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Marquer le code comme vérifié
    user.isVerifiedCodeReset = true;
    await user.save();

    // Générer un token temporaire pour la réinitialisation
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Le token expire après 1 heure
    });

    res.status(200).json({ message: 'Reset code verified successfully', token });
  } catch (err) {
    console.error('Error verifying reset code:', err);
    res.status(500).json({ message: 'Error verifying reset code' });
  }
});



module.exports = router;
