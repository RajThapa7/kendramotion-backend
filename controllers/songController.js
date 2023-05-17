const Song = require("../models/songModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getSongs = catchAsync(async (req, res) => {
  const songs = await Song.find();
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

module.exports = { getSongs, createSong };
