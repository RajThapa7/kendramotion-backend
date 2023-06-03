const Movie = require("../models/movieModel");
const Video = require("../models/videoModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const getLatestWorks = catchAsync(async (req, res) => {
  const movieQuery = Movie.find({ latest: true });
  const videoQuery = Video.find({ latest: true });

  const movieFeatures = new APIFeatures(movieQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const videoFeatures = new APIFeatures(videoQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const movies = await movieFeatures.query;
  const videos = await videoFeatures.query;

  const latestWork = [...movies, ...videos];

  res.status(200).json(latestWork);
});

module.exports = { getLatestWorks };
