const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

const moment = require('moment-timezone');

router.post("/addExpense", async (req, res) => {
  try {
    const { amount, description, categoryID, userID } = req.body;
    
    // Get the current time in Morocco (Africa/Casablanca)
    const date = moment().tz("Africa/Casablanca").toDate(); // Convert current time to Morocco local time
    
    const newExpense = new Expense({
      amount, 
      date, 
      description, 
      categoryID, 
      userID
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la création de la dépense",
      error: err.message,
    });
  }
});

// **Récupérer toutes les dépenses (Read)**
router.get("/getAllExpenses", async (req, res) => {
  try {
    const expenses = await Expense.find().populate("categoryID userID");
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des dépenses", error: err.message });
  }
});

// **Récupérer une dépense spécifique (Read)**
router.get("/getExpense/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("categoryID userID");
    if (!expense) return res.status(404).json({ message: "Dépense non trouvée" });
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la dépense", error: err.message });
  }
});

// **Mettre à jour une dépense (Update)**
router.put("/updateExpense/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpense) return res.status(404).json({ message: "Dépense non trouvée" });
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la dépense", error: err.message });
  }
});

// **Supprimer une dépense (Delete)**
router.delete("/deleteExpense/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ message: "Dépense non trouvée" });
    res.status(200).json({ message: "Dépense supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la dépense", error: err.message });
  }
});
router.get("/getExpensesByDate", async (req, res) => {
  try {
    const { date } = req.query; // Assume the date is passed as a query parameter

    // Convert the received date to Moroccan time
    const startOfDay = moment.tz(date, "Africa/Casablanca").startOf('day').toDate();
    const endOfDay = moment.tz(date, "Africa/Casablanca").endOf('day').toDate();

    // Query the database to find expenses within the date range
    const expenses = await Expense.find({
      date: {
        $gte: startOfDay, 
        $lte: endOfDay
      }
    }).populate("categoryID userID");

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des dépenses par date",
      error: err.message,
    });
  }
});

module.exports = router;
