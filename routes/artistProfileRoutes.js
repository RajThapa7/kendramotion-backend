const express = require("express");
const artistProfileController = require("../controllers/artistProfileController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, artistProfileController.createArtistProfile)
  .get(artistProfileController.getArtistProfiles);

module.exports = router;
