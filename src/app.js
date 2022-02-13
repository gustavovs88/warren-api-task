const express = require("express");
const routes = require("./routes/appRoutes");

const Transaction = require("./models/Transaction");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(routes);

app.post("/transactions/deposit", async (req, res) => {
  const deposit = req.body;
  await Transaction.create(deposit);
  res.sendStatus(201);
});

module.exports = app;
