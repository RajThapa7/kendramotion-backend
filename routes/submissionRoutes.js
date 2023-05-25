const express = require("express");
const submissionController = require("../controllers/submissionController");

const router = express.Router();

router
  .route("/")
  .get(submissionController.getAllSubmissions)
  .post(submissionController.createSubmission);

router
  .route("/:id")
  .get(submissionController.getSubmission)
  .delete(submissionController.deleteSubmission);

module.exports = router;
