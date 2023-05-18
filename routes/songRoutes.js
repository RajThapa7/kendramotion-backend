const express = require("express");
const songController = require("../controllers/songController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, songController.createSong)
  .get(songController.getSongs);

module.exports = router;
