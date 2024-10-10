const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const client = require("./db/client");
client.connect();
app.use(express.json());

app.use("/api", require("./api"));
app.use((error, req, res, next) => {
  if (res.statusCode < 400) res.status(500);
  res.send({
    message: error.message,
    name: error.name,
  });
});

module.exports = app;
