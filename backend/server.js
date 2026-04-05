const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require("path");

const batchRoutes = require('./routes/batch');
const transportRoutes = require('./routes/transport');

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MYSQL CONNECTION ================= */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Janhavi@6305',
  database: 'foodchain'
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected (foodchain)");
});

/* ================= AGGREGATOR DATA ================= */
app.get('/api/aggregator', (req, res) => {

  const query = `
    SELECT *
    FROM batches
    ORDER BY timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });

});
 
//warehouse
app.get("/api/warehouse", (req, res) => {
  db.query("SELECT id, batch_id, temperature FROM warehouse ORDER BY id DESC",
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(result);
    }
  );
});

/* -------- TRANSPORT DATA API -------- */
app.get("/api/transport", (req, res) => {
  const sql = "SELECT * FROM transport ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Transport fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});

/* -------- RETAILER DATA API -------- */
app.get("/api/retailer", (req, res) => {
  const sql = "SELECT * FROM retailer ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Retailer fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});


/* ================= STATIC FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ================= ROUTES ================= */
app.use('/api/batch', batchRoutes);
app.use('/api/transport', transportRoutes);

const warehouseRoutes = require('./routes/warehouse');
const retailerRoutes = require('./routes/retailer');

app.use('/api/warehouse', warehouseRoutes);
app.use('/api/retailer', retailerRoutes);

/* ================= HOME ================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "home.html"));
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
