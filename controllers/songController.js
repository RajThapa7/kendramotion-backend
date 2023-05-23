const Song = require("../models/songModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const getSongs = catchAsync(async (req, res) => {
  const songQuery = Song.find();

  const features = new APIFeatures(songQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const songs = await features.query;

  res.status(200).json(songs);
});

const createSong = catchAsync(async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.name ||
    !req.body.url ||
    !req.body.position
  ) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  await Song.create(req.body);

  res.status(201).json({ message: "Song created successfully" });
});

const deleteSong = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Song.findByIdAndDelete(id);

  res.status(204).json();
});

const updateSong = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Song.findByIdAndUpdate(id, req.body);

  res
    .status(200)
    .json({ status: "success", message: "Song updated successfully" });
});

const getSong = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  const song = await Song.findById(id);

  res.status(200).json(song);
});

module.exports = { getSongs, createSong, deleteSong, updateSong, getSong };
