const express = require("express");
const movieController = require("../controllers/movieController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(movieController.getMovies)
  .post(verifyUser, movieController.createMovie);

router
  .route("/:id")
  .delete(verifyUser, movieController.deleteMovie)
  .patch(verifyUser, movieController.updateMovie);

module.exports = router;
