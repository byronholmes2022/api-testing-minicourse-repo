const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));

router.get("/", (req, res) => {
  res.send("hello from /api");
});

module.exports = router;
