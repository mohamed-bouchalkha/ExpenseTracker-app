const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Ajouter une nouvelle catégorie
router.post('/addCategory', async (req, res) => {
  const { categoryId, name } = req.body;

  try {
    const existingCategory = await Category.findOne({ categoryId });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category ID already exists' });
    }

    const category = new Category({ categoryId, name });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Récupérer toutes les catégories
router.get('/getCategories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Récupérer une catégorie par ID
router.get('/getCategory/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mettre à jour une catégorie par ID
router.put('/updateCategory/:id', async (req, res) => {
  const { name } = req.body;

  try {
    // Utilisation de `_id` pour trouver la catégorie
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Supprimer une catégorie par ID
router.delete('/deleteCategory/:id', async (req, res) => {
  try {
    // Utilisation de `_id` pour trouver et supprimer la catégorie
    const category = await Category.findOneAndDelete({ _id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
