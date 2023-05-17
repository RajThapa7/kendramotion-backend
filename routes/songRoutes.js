const express = require("express");
const songController = require("../controllers/songController");

const router = express.Router();

router.route("/").post(songController.createSong).get(songController.getSongs);

module.exports = router;
