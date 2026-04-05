const express = require('express');
const router = express.Router();
const db = require('../db');
const QRCode = require('qrcode');

router.post('/', async (req, res) => {
  const { batchId, quantity, grade, delay, risk, farmerId } = req.body;

  const sql = `
    INSERT INTO batches
    (batch_id, farmer_id, quantity, grade, delay, risk, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [batchId, farmerId || null, quantity, grade, delay, risk || null],
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      try {
        const qrUrl = `http://localhost:3000/consumer.html?batch=${batchId}`;

        const qrImage = await QRCode.toDataURL(qrUrl);

        res.json({
          message: "Batch saved!",
          batchId,
          qr: qrImage
        });

      } catch (e) {
        console.log(e);
        res.json({
          message: "Batch saved, QR failed",
          batchId
        });
      }
    }
  );
});

module.exports = router;
