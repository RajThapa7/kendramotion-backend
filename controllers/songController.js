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
    !req.body.thumbImage ||
    !req.body.position
  ) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  const { title, name, url, thumbImage, position } = req.body;
  await Song.create({
    title,
    name,
    url,
    thumbImage,
    position,
  });

  const newSongs = await Song.find();

  res.status(201).json(newSongs);
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

module.exports = { getSongs, createSong, deleteSong, updateSong };
