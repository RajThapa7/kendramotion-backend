const Movie = require("../models/movieModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const getMovies = catchAsync(async (req, res) => {
  const movieQuery = Movie.find();

  const features = new APIFeatures(movieQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query.populate("artist");

  res.status(200).json(movies);
});

const createMovie = catchAsync(async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.name ||
    !req.body.url ||
    !req.body.thumbImage ||
    !req.body.position ||
    !req.body.artist
  ) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  const { title, name, url, thumbImage, position, artist } = req.body;

  await Movie.create({
    title,
    name,
    url,
    thumbImage,
    position,
    artist,
  });

  const newMovies = await Movie.find();

  return res.status(201).json(newMovies);
});

const deleteMovie = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Movie.findByIdAndDelete(id);

  res.status(204).json();
});

const updateMovie = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Movie.findByIdAndUpdate(id, req.body);

  res
    .status(200)
    .json({ status: "success", message: "Movie updated successfully" });
});

module.exports = { getMovies, createMovie, deleteMovie, updateMovie };
