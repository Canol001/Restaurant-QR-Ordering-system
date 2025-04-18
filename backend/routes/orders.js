const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For unique order ID generation
const Order = require('../models/Order');

const router = express.Router();

// Get all orders (for admin or user with the right permissions)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by user ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders.' });
  }
});

// Submit a new order (creates a new order with a unique order ID)
router.post('/', async (req, res) => {
  try {
    const { tableId, items, total, userId } = req.body;

    // Generate a unique order ID
    const orderId = uuidv4();

    // Create a new order instance
    const order = new Order({
      orderId,  // Unique order ID
      tableId,  // Table ID passed from frontend (usually from QR code)
      items,    // Items array (menu items selected by the user)
      total,    // Total cost of the order
      userId,   // User or session ID to associate with the order
    });

    // Save the order to the database
    await order.save();
    res.status(201).json({ message: 'Order placed successfully!', orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (for example, from 'pending' to 'completed')
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
