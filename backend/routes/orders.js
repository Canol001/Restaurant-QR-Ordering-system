const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For unique order ID generation
const Order = require('../models/Order');
const verifyAdmin = require('../middleware/auth');

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

// Get orders by user ID (for user-specific order history)
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

// Admin-only orders route
router.get('/admin/orders', verifyAdmin, (req, res) => {
  // Add admin-only logic if needed
  res.status(200).json({ message: 'Admin access granted to orders.' });
});

// Update order status (e.g., from 'pending' to 'completed')
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

// PATCH: Update only the status of an order
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Express backend (Node.js)
router.post('/sync', async (req, res) => {
  const { orderIds } = req.body;
  if (!Array.isArray(orderIds)) {
    return res.status(400).json({ error: 'Invalid orderIds' });
  }

  try {
    const orders = await Order.find({ userId: { $in: orderIds } });
    res.json(orders);
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
