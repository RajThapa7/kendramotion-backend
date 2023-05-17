const express = require("express");
const artistProfileController = require("../controllers/artistProfileController");

const router = express.Router();

router
  .route("/")
  .post(artistProfileController.createArtistProfile)
  .get(artistProfileController.getArtistProfiles);

module.exports = router;
