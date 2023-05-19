const express = require("express");
const songController = require("../controllers/songController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(songController.getSongs)
  .post(verifyUser, songController.createSong);

router
  .route("/:id")
  .delete(verifyUser, songController.deleteSong)
  .patch(verifyUser, songController.updateSong);

module.exports = router;
