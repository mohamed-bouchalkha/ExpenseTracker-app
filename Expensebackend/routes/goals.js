const express = require('express');
const Goal = require('../models/Goal');
const router = express.Router();

router.post('/addgoals', async (req, res) => {
  const { userID, targetDate, amount } = req.body;

  try {
    // Vérifier si un objectif existe déjà pour cet utilisateur et cette date
    const existingGoal = await Goal.findOne({ userID, targetDate: new Date(targetDate) });
    if (existingGoal) {
      return res.status(400).json({ message: `A goal already exists for ${targetDate}.` });
    }

    // Créer un nouvel objectif
    const newGoal = new Goal({ userID, targetDate: new Date(targetDate), amount });
    await newGoal.save();

    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Exporter le routeur
module.exports = router;
