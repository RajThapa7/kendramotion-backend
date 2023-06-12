const express = require("express");
const artistProfileController = require("../controllers/artistProfileController");
const { verifyUser } = require("../middlewares/authMiddleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: `${__dirname}/../assets/profile/` });

router
  .route("/")
  .get(artistProfileController.getArtistProfiles)
  .post(verifyUser, artistProfileController.createArtistProfile);

router
  .route("/latest/:id")
  .get(artistProfileController.getArtistLatestReleases);

router
  .route("/upload")
  .post(
    verifyUser,
    upload.single("profile"),
    artistProfileController.uploadProfile
  );

router
  .route("/:id")
  .delete(verifyUser, artistProfileController.deleteArtistProfile)
  .get(verifyUser, artistProfileController.getArtistProfile)
  .patch(verifyUser, artistProfileController.updateArtistProfile);

module.exports = router;
