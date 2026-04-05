const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Janhavi@6305",      // put your MySQL password if any
  database: "foodchain"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL connected (foodchain)");
  }
});

module.exports = db;
