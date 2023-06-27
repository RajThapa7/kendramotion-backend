const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const memberController = require("../controllers/memberController");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: `${__dirname}/../assets/profile/` });

router
  .route("/")
  .get(memberController.getMembers)
  .post(verifyUser, memberController.createMember);

router
  .route("/upload")
  .post(verifyUser, upload.single("profile"), memberController.uploadProfile);

router
  .route("/:id")
  .get(verifyUser, memberController.getMember)
  .delete(verifyUser, memberController.deleteMember)
  .patch(verifyUser, memberController.updateMember);

module.exports = router;
