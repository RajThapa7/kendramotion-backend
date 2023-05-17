const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router
  .route("/")
  .post(movieController.createMovie)
  .get(movieController.getMovies);

module.exports = router;
