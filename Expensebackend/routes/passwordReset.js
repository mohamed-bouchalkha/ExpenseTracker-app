const express = require('express');
const crypto = require('crypto');
const User = require('../models/User'); // Assurez-vous d'importer le modèle User
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Route pour demander une réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Générer un token sécurisé
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Configurer le transporteur nodemailer pour envoyer l'email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Vous pouvez utiliser un autre service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Créer le lien de réinitialisation
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Envoyer l'email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Reset password email sent successfully' });
    } catch (err) {
        console.error('Error sending reset email:', err);
        res.status(500).json({ message: 'Error sending reset password email' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Supprimer la logique de hachage et stocker le mot de passe en clair
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;
