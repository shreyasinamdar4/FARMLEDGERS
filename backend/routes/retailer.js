const express = require('express');
const router = express.Router();
const db = require('../db');
const QRCode = require('qrcode');

// POST /api/retailer
router.post('/', async (req, res) => {
  const { batch_id, store_name, quantity_received, arrival_time } = req.body;

  try {
    // Generate QR code as the **consumer URL** pointing to this batch
    const traceUrl = `${req.protocol}://${req.get('host')}/consumer-qr.html?batch=${batch_id}`;

    const sql = `INSERT INTO retailer (batch_id, store_name, quantity_received, arrival_time, qr_code)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [batch_id, store_name, quantity_received, arrival_time, traceUrl], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Retailer data saved!", qr_code: traceUrl });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
