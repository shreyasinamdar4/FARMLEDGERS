const express = require('express');
const router = express.Router();
const db = require('../db');

// Add warehouse info
router.post('/', (req, res) => {
  const { batchId, temperature } = req.body;

  if (!batchId || temperature === undefined) {
    return res.status(400).json({ error: "batchId and temperature are required" });
  }

  const sql = `
    INSERT INTO warehouse (batch_id, temperature)
    VALUES (?, ?)
  `;

  db.query(sql, [batchId, temperature], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Warehouse data saved" });
  });
});

// Get all warehouse info
router.get('/', (req, res) => {
  const sql = "SELECT * FROM warehouse";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
