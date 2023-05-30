const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const multer = require("multer");
const { verifyUser } = require("../middlewares/authMiddleware");

const upload = multer({ dest: `${__dirname}/../assets/banners/` });

router
  .route("/")
  .get(bannerController.getBanners)
  .post(verifyUser, upload.single("banner"), bannerController.createBanner)
  .delete(verifyUser, bannerController.deleteBanner);

router.route("/:id").get(bannerController.getBanner);

module.exports = router;
