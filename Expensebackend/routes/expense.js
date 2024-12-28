const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const { ObjectId } = require('mongoose').Types;

const moment = require('moment-timezone');
const authenticateUser = require("../middlewares/authenticateUser");
const mongoose = require('mongoose');

// **Récupérer une dépense spécifique (Read)**
router.get("/getExpense/:id", async (req, res) => {
  try {
    // Retrieve the expense using the ID passed in the URL parameter
    const expense = await Expense.findById(req.params.id).populate("categoryID userID");
    
    // If the expense is not found, return a 404 error
    if (!expense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }
    
    // If found, return the expense data
    res.status(200).json(expense);
  } catch (err) {
    // If an error occurs during the process, return a 500 error
    res.status(500).json({ message: "Erreur lors de la récupération de la dépense", error: err.message });
  }
});

router.get('/expenses-summary', async (req, res) => {
  try {
    // Vérification du token JWT dans les en-têtes
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token du header Authorization
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }

    // Vérification du token JWT et récupération de l'ID de l'utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // ID de l'utilisateur depuis le token

    // Récupère les catégories pour cet utilisateur
    const categories = await Category.find(); // Peut être filtré par utilisateur si nécessaire

    // Générer le résumé des dépenses pour chaque catégorie
    const summary = await Promise.all(categories.map(async (category) => {
      // Récupère les dépenses de l'utilisateur pour cette catégorie
      const expenses = await Expense.find({ categoryID: category._id, userID: userId });
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        name: category.name, // Retourne le nom de la catégorie
        categoryID: category._id,
        amount: totalAmount,
        expenses: expenses.length,
      };
    }));

    res.status(200).json(summary); // Envoie le résumé des dépenses
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get("/expenseschart", authenticateUser, async (req, res) => {
  try {
    const userID = req.userID; // ID de l'utilisateur authentifié

    const expenses = await Expense.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } }, // Filtre par utilisateur
      {
        $group: {
          _id: "$categoryID",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 0,
          amount: "$totalAmount",
          categoryID: { $arrayElemAt: ["$categoryDetails", 0] },
        },
      },
    ]);

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des dépenses.", error });
  }
});


router.post('/addExpense', async (req, res) => {
  try {
    const { amount, description, categoryID } = req.body;

    // Vérifier si le token est présent dans les headers
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token depuis les headers
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Vérifier et décoder le token pour obtenir l'ID de l'utilisateur
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilisez la clé secrète pour vérifier le token
    } catch (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: 'Invalid or malformed token', error: err.message });
    }

    const userID = decoded.id; // Accéder à l'ID de l'utilisateur depuis le token

    // Vérifier si les autres données sont présentes
    if (!amount || !categoryID || !userID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const date = moment().tz("Africa/Casablanca").toDate();

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
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création de la dépense",
      error: err.message,
    });
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


// Route pour supprimer une dépense
router.delete("/deleteExpense/:id", async (req, res) => {
  const expenseId = req.params.id;
  
  // Validation de l'ID pour s'assurer que c'est un ObjectId valide
  if (!ObjectId.isValid(expenseId)) {
    return res.status(400).json({ message: "ID de dépense invalide" });
  }
  
  try {
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) return res.status(404).json({ message: "Dépense non trouvée" });
    res.status(200).json({ message: "Dépense supprimée avec succès" });
  } catch (err) {
    console.error('Erreur lors de la suppression de la dépense:', err);
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
    const expenses = await Expense.find(expensesQuery).populate("categoryID userID");


    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des dépenses par date",
      error: err.message,
    });
  }
});
router.get('/expenses-summary2', async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch all categories
    const categories = await Category.find();

    // Generate summary for each category with detailed expenses
    const summary = await Promise.all(
      categories.map(async (category) => {
        // Fetch expenses for this category and user, and populate category and user data
        const expenses = await Expense.find({ categoryID: category._id, userID: userId })
          .populate('categoryID')  // Populating category data for each expense
          .populate('userID');     // Populating user data if needed

        // Debugging: log fetched expenses to check if populate is working
        console.log(`Fetched expenses for category: ${category.name}`, expenses);

        // Calculate the total amount for the category
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Map the expenses into detailed format
        const detailedExpenses = expenses.map(expense => ({
          id: expense._id.toString(),
          name: expense.description || 'No description', // Use the 'description' field for the name
          amount: expense.amount,
          date: expense.date,
          category: expense.categoryID ? expense.categoryID.name : 'No category',  // Populated category name
          user: expense.userID ? expense.userID.username : 'No user' // Populated user username
        }));

        // Debugging: log detailed expenses
        console.log('Detailed Expenses:', JSON.stringify(detailedExpenses, null, 2));

        return {
          name: category.name,
          categoryID: category._id.toString(),
          amount: totalAmount,
          expenses: expenses.length,
          detailedExpenses,
        };
      })
    );

    // Send the summary with detailed expenses as a response
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
