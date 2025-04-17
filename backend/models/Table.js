const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableId: { type: String, required: true, unique: true },
  qrCodeUrl: String,
});

module.exports = mongoose.model('Table', tableSchema);