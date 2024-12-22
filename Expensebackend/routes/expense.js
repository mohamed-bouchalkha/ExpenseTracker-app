const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// **Ajouter une dépense (Create)**
router.post("/addExpense", async (req, res) => {
  try {
    const { amount, date, description, categoryID, userID } = req.body;
    const newExpense = new Expense({ amount, date, description, categoryID, userID });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la dépense", error: err.message });
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

module.exports = router;
