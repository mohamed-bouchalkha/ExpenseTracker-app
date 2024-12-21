const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Inscription d'un utilisateur
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log(`Attempt to register failed: User with email ${email} already exists.`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ firstName, lastName, email, password });

    await user.save();

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Le token expire dans 1 heure
    });

    console.log(`User registered successfully: ${firstName} ${lastName} (${email})`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
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

module.exports = router;