const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const multer = require("multer");
const { verifyUser } = require("../middlewares/authMiddleware");

const upload = multer({ dest: `${__dirname}/../assets/banners/` });

router
  .route("/")
  .get(bannerController.getBanners)
  .post(verifyUser, bannerController.createBanner);

router
  .route("/upload")
  .post(verifyUser, upload.single("banner"), bannerController.uploadBanner);

router
  .route("/:id")
  .get(bannerController.getBanner)
  .delete(verifyUser, bannerController.deleteBanner)
  .patch(verifyUser, bannerController.editBanner);

module.exports = router;
