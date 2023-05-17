const Movie = require("../models/movieModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getMovies = catchAsync(async (req, res) => {
  const movies = await Movie.find();
  res.status(200).json(movies);
});

const createMovie = catchAsync(async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.name ||
    !req.body.url ||
    !req.body.thumbImage ||
    !req.body.position
  ) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  const { title, name, url, thumbImage, position } = req.body;

  await Movie.create({
    title,
    name,
    url,
    thumbImage,
    position,
  });

  const newMovies = await Movie.find();

  return res.status(201).json(newMovies);
});

module.exports = { getMovies, createMovie };
