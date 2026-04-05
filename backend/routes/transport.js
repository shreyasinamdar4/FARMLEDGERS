const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  console.log("Transport API hit");

  const {
    batchId,
    fromLoc,
    toLoc,
    vehicle,
    vehicleType,
    startTime,
    endTime,
    tempScore,
    arrivalTime
  } = req.body;

  const sql = `
    INSERT INTO transport
    (batch_id, from_location, to_location, vehicle_id,
     vehicle_type, start_time, end_time,
     temp_score, arrival_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      batchId,
      fromLoc,
      toLoc,
      vehicle,
      vehicleType,
      startTime,
      endTime,
      tempScore,
      arrivalTime
    ],
    (err) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "DB insert failed" });
      }

      console.log("Transport inserted");
      res.json({ message: "Transport stored in DB" });
    }
  );
});

module.exports = router;
