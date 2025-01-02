const express = require('express');
const Goal = require('../models/Goal');
const router = express.Router();
const mongoose = require("mongoose");


router.post('/addgoals', async (req, res) => {
  const { userID, targetDate, amount } = req.body;

  try {
    const targetDateObj = new Date(targetDate);
    const targetMonth = targetDateObj.getMonth(); // Obtenir le mois (0-11)
    const targetYear = targetDateObj.getFullYear(); // Obtenir l'année

    // Vérifier si un objectif existe déjà pour cet utilisateur et ce mois
    const existingGoal = await Goal.findOne({
      userID,
      $expr: {
        $and: [
          { $eq: [{ $month: "$targetDate" }, targetMonth + 1] }, // +1 car MongoDB utilise 1-12 pour les mois
          { $eq: [{ $year: "$targetDate" }, targetYear] },
        ],
      },
    });

    if (existingGoal) {
      return res.status(400).json({ message: `A goal already exists for the month of ${targetMonth + 1}/${targetYear}.` });
    }

    // Créer un nouvel objectif
    const newGoal = new Goal({
      userID,
      targetDate: targetDateObj,
      amount,
    });
    await newGoal.save();

    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all goals grouped by month for a user
router.get("/getMonthlyGoals", async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ensure userID is a valid ObjectId format
    const userObjectId = new mongoose.Types.ObjectId(userID); // This line is fine without the 'new'

    const goals = await Goal.aggregate([
      { $match: { userID: userObjectId } },
      {
        $group: {
          _id: { $month: "$targetDate" },
          totalAmount: { $sum: "$amount" },
          goals: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { "_id": 1 }, // Sort by month
      },
    ]);

    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching monthly goals:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

module.exports = router;
