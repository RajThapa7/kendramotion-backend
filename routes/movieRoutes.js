const express = require("express");
const movieController = require("../controllers/movieController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, movieController.createMovie)
  .get(movieController.getMovies);

module.exports = router;
