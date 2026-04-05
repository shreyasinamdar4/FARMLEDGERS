const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:batchId', (req, res) => {
  const { batchId } = req.params;

  const sql = `
    SELECT r.qr_code, r.store_name AS store, r.quantity_received, r.arrival_time,
           w.batch_id, w.temperature, w.grade, w.freshness,
           f.region AS farmer_region, f.product_name, f.category, f.shelf_life
    FROM retailer r
    JOIN warehouse w ON r.batch_id = w.batch_id
    JOIN farmer f ON w.batch_id = f.batch_id
    WHERE r.batch_id = ?
    LIMIT 1
  `;

  db.query(sql, [batchId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result[0]) return res.status(404).json({ error: "Batch not found" });
    res.json(result[0]);
  });
});

module.exports = router;
