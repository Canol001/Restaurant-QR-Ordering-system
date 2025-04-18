const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  tableId: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      requirements: String, // Special requirements or description
    },
  ],
  status: { type: String, default: 'Pending' },
  total: Number,
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Link to the user (session)
});

module.exports = mongoose.model('Order', orderSchema);
