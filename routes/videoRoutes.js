const express = require("express");
const videoController = require("../controllers/videoController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(videoController.getVideos)
  .post(verifyUser, videoController.createVideo);

router
  .route("/:id")
  .get(verifyUser, videoController.getVideo)
  .delete(verifyUser, videoController.deleteVideo)
  .patch(verifyUser, videoController.updateVideo);

module.exports = router;
