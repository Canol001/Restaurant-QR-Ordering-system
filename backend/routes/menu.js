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

// ✅ Update a menu item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a menu item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
