const express = require("express");
const submissionController = require("../controllers/submissionController");
const multer = require("multer");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: `${__dirname}/../assets/submissions/`,
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router
  .route("/")
  .get(verifyUser, submissionController.getAllSubmissions)
  .post(
    upload.fields([
      { name: "document", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
    submissionController.createSubmission
  );

router.route("/document/:id").get(verifyUser, submissionController.getDocument);

router
  .route("/:id")
  .get(submissionController.getSubmission)
  .delete(submissionController.deleteSubmission);

module.exports = router;
