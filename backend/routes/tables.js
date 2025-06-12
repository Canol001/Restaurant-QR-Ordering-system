const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const QRCode = require('qrcode');

// Generate QR code for a table
router.post('/', async (req, res) => {
  try {
    const { tableId } = req.body;
    const url = `http://localhost:5173/menu?table=${tableId}`; // Update to deployed URL later
    const qrCodeUrl = await QRCode.toDataURL(url);
    const table = new Table({ tableId, qrCodeUrl });
    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate-batch', async (req, res) => {
  try {
    const { numberOfTables } = req.body;
    const tableData = [];

    for (let i = 1; i <= numberOfTables; i++) {
      const url = `http://localhost:5173/menu?table=${i}`;
      const qrCodeUrl = await QRCode.toDataURL(url);

      const table = new Table({ tableId: i, qrCodeUrl });
      await table.save();
      tableData.push({ tableId: i, qrCodeUrl });
    }

    res.json(tableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;