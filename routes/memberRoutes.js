const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const memberController = require("../controllers/memberController");

const router = express.Router();

router
  .route("/")
  .get(memberController.getMembers)
  .post(verifyUser, memberController.createMember);

router
  .route("/:id")
  .get(verifyUser, memberController.getMember)
  .delete(verifyUser, memberController.deleteMember)
  .patch(verifyUser, memberController.updateMember);

module.exports = router;
