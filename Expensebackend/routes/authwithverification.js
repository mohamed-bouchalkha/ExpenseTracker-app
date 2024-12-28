const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { sendVerificationEmail } = require('../utils/mail'); // Importez la fonction d'envoi d'e-mail

// Collection temporaire pour stocker les utilisateurs en attente de vérification (optionnel)
let pendingUsers = {}; // Utilisez une base de données ou une méthode plus robuste dans la production
const crypto = require('crypto');

// Génère un code de 6 chiffres
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Générer un code de vérification
    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code valide pendant 10 minutes

    // Créez un nouvel utilisateur avec le code et la date d'expiration
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      verificationCode,
      codeExpiresAt,
    });

    // Sauvegardez l'utilisateur dans la base de données
    await newUser.save();

    // Envoyer le code de vérification par e-mail
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for the verification code.',
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

    if (!user.isVerified) {
      console.log(`Login failed: User with email ${email} is not verified.`);
console.log
      return res.status(403).json({
        message:
          'Your account is not verified. Please check your email and verify your account before logging in.',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // console.log(`Login failed: Invalid credentials for user with email ${email}.`);
      // return res.status(400).json({ message: 'Invalid credentials' });
            Alert.alert('Error', error.response.data.message);  
      
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log(`Login successful: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      userID: user._id, // Ajoutez l'ID de l'utilisateur ici

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

router.post('/verify-code', async (req, res) => {
  const { code } = req.body;

  try {
    // Chercher un utilisateur avec le code fourni et dont le code n'est pas expiré
    const user = await User.findOne({
      verificationCode: code,
      codeExpiresAt: { $gte: Date.now() }, // Vérifie que le code n'est pas expiré
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired code.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    // Validez l'utilisateur
    user.isVerified = true;
    user.verificationCode = null; // Supprimez le code
    user.codeExpiresAt = null; // Supprimez la date d'expiration
    await user.save();

    res.status(200).json({ message: 'User verified successfully!' });
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
