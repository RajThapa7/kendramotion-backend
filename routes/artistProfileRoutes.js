const express = require("express");
const artistProfileController = require("../controllers/artistProfileController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(artistProfileController.getArtistProfiles)
  .post(verifyUser, artistProfileController.createArtistProfile);

router
  .route("/:id")
  .delete(verifyUser, artistProfileController.deleteArtistProfile)
  .get(verifyUser, artistProfileController.getArtistProfile)
  .patch(verifyUser, artistProfileController.updateArtistProfile);

module.exports = router;
