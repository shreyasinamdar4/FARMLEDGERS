const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));

// Fair pricing logic
function calculateFairPrice(supply, demand, msp, historicalPrice) {
  let supplyPrice;

  if (supply > demand) {
    supplyPrice = historicalPrice * 0.9;
  } else {
    supplyPrice = historicalPrice * 1.1;
  }

  let dataDrivenPrice = (historicalPrice + supplyPrice) / 2;

  return Math.max(msp, supplyPrice, dataDrivenPrice);
}

// API
app.post("/fair-price", (req, res) => {
  const { supply, demand, msp, historicalPrice } = req.body;

  const fairPrice = calculateFairPrice(
    supply, demand, msp, historicalPrice
  );

  res.json({ fairPrice });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// function deleteRecord(index) {
//   let records = JSON.parse(localStorage.getItem("fairPrices")) || [];

//   records.splice(index, 1); // remove selected record

//   localStorage.setItem("fairPrices", JSON.stringify(records));

//   location.reload(); // refresh page to show updated list
// }
