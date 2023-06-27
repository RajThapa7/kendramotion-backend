const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.route("/").delete(verifyUser, imageController.deleteImage);

module.exports = router;
