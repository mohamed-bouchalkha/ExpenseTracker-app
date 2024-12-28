require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const authRouteswithverification = require('./routes/authwithverification');
const categoryRoutes = require('./routes/category');
const passwordResetRoutes = require('./routes/passwordReset');
const expenseRoutes = require('./routes/expense'); // Importer les routes des dépenses

const cors = require("cors");

const app = express();
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/authv', authRouteswithverification);
app.use('/api/categories', categoryRoutes);   
app.use('/api/expenses', expenseRoutes);
app.use('/api/password', passwordResetRoutes);

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
