const express = require("express");
const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

router
  .route("/")
  .get(feedbackController.getFeedbacks)
  .post(feedbackController.createFeedback);

module.exports = router;
