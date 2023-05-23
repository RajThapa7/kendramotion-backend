const express = require("express");
const latestWorkController = require("../controllers/latestWorkController");

const router = express.Router();

router.route("/").get(latestWorkController.getLatestWorks);

module.exports = router;
