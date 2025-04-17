const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a menu item (admin)
router.post('/', async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;