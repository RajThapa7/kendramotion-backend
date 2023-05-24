const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(verifyUser, feedbackController.getFeedbacks)
  .post(feedbackController.createFeedback);

router
  .route("/:id")
  .get(verifyUser, feedbackController.getFeedback)
  .delete(feedbackController.deleteFeedback);

module.exports = router;
