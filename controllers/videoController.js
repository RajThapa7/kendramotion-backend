const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const getVideos = catchAsync(async (req, res) => {
  const videoQuery = Video.find();

  const features = new APIFeatures(videoQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const videos = await features.query.populate("artists");

  res.status(200).json(videos);
});

const createVideo = catchAsync(async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.name ||
    !req.body.url ||
    !req.body.position ||
    !req.body.artists
  ) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  await Video.create(req.body);

  return res.status(201).json({ message: "Video created successfully" });
});

const deleteVideo = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Video.findByIdAndDelete(id);

  res.status(204).json();
});

const updateVideo = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Video.findByIdAndUpdate(id, req.body);

  res
    .status(200)
    .json({ status: "success", message: "Video updated successfully" });
});

const getVideo = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  const video = await Video.findById(id).populate("artists");

  res.status(200).json(video);
});

module.exports = { getVideos, createVideo, deleteVideo, updateVideo, getVideo };
