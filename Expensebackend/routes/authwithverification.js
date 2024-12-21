const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { sendVerificationEmail } = require('../utils/mail'); // Importez la fonction d'envoi d'e-mail

// Collection temporaire pour stocker les utilisateurs en attente de vérification (optionnel)
let pendingUsers = {}; // Utilisez une base de données ou une méthode plus robuste dans la production

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe déjà
    if (pendingUsers[email]) {
      return res.status(400).json({ message: 'A verification email has already been sent to this email address.' });
    }

    // Créer un utilisateur sans l'enregistrer dans la base de données
    const user = { firstName, lastName, email, password };

    // Créer un token JWT pour la vérification par e-mail
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '24h', // Le token expire dans 24 heures
    });

    // Stocker l'utilisateur dans la collection temporaire
    pendingUsers[email] = { user, verificationToken };

    // Envoyer l'email de vérification
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login failed: User with email ${email} not found.`);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: Invalid credentials for user with email ${email}.`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log(`Login successful: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Vérifiez le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe dans la collection temporaire
    const pendingUser = pendingUsers[decoded.email];
    if (!pendingUser) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    // Ajouter l'utilisateur à la base de données
    const { user } = pendingUser;

    // Créez l'utilisateur dans la base de données (par exemple avec un modèle User)
    const newUser = new User(user);
    await newUser.save();

    // Supprimez l'utilisateur de la collection temporaire
    delete pendingUsers[decoded.email];

    res.status(200).json({ message: 'Email verified and user registered successfully!' });
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
