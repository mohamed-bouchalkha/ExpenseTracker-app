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
    
    // Renvoi du token et de l'ID utilisateur
    res.status(200).json({
      message: 'Login successful',
      token,
      userID: user._id,  // Renvoi de l'ID de l'utilisateur
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Récupérer les dépenses de l'utilisateur authentifié
router.get("/getAllExpenses", async (req, res) => {
  try {
    const userID = req.query.userID; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { month } = req.query; // Récupérer le mois depuis les paramètres de la requête
    let expensesQuery = { userID }; // Filtrer par l'ID de l'utilisateur authentifié

    if (month) {
      // Si un mois est fourni, filtrez les dépenses en fonction du mois
      const startOfMonth = moment(month, "MMMM").startOf("month").toDate();
      const endOfMonth = moment(month, "MMMM").endOf("month").toDate();

      expensesQuery.date = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }

    // Récupérer les dépenses de l'utilisateur authentifié
    const expenses = await Expense.find(expensesQuery).populate("categoryID");

    // Calculer le montant total des dépenses
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      expenses,
      totalAmount,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des dépenses:", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des dépenses",
      error: err.message,
    });
  }
});
// Déconnexion d'un utilisateur
router.post('/logout', async (req, res) => {
  const { userID } = req.body; // ID utilisateur envoyé depuis le frontend

  try {
    // Mettre à jour le champ "isLoggedIn" de l'utilisateur à false (si utilisé)
    await User.findByIdAndUpdate(userID, { isLoggedIn: false });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
});



module.exports = router;