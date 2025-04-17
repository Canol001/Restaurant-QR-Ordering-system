const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableId: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  status: { type: String, default: 'Pending' },
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);