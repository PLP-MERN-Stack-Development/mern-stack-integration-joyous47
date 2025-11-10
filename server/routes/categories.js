const express = require('express');
const Category = require('../models/Category');
const { validateCategory } = require('../middleware/validation');
const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new category
router.post('/', validateCategory, async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

