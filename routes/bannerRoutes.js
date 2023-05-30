const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const multer = require("multer");
const { verifyUser } = require("../middlewares/authMiddleware");

// const upload = multer({ dest: `${__dirname}/../assets/banners/` });
const upload = multer({ dest: `${__dirname}/../assets/banners/` });

/* const storage = multer.diskStorage({
  destination: `${__dirname}/../assets/banners`,
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    // cb(null, +"bannerImage" + fileExtension);
    cb(null, "99825.jpg");
  },
}); */

// const upload = multer({ storage: storage });

router
  .route("/")
  .post(verifyUser, upload.single("banner"), bannerController.createBanner);

module.exports = router;
