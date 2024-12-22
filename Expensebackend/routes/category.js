const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.post('/addCategory', async (req, res) => {
  const { name } = req.body;

  try {
    // Vérifier si une catégorie avec le même nom existe déjà
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Créer une nouvelle catégorie (MongoDB générera automatiquement un _id)
    const category = new Category({ name });
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


router.get('/getCategory/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id); // Utilisation de _id pour trouver la catégorie
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/updateCategory/:id', async (req, res) => {
  const { name } = req.body;

  try {
    // Utilisation de _id pour trouver la catégorie et mettre à jour son nom
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true } // Renvoie la catégorie mise à jour
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


router.delete('/deleteCategory/:id', async (req, res) => {
  try {
    // Utilisation de _id pour trouver et supprimer la catégorie
    const category = await Category.findByIdAndDelete(req.params.id);

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
