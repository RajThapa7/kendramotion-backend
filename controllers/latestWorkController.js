const Song = require("../models/songModel");
const Video = require("../models/videoModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const getLatestWorks = catchAsync(async (req, res) => {
  const songQuery = Song.find({ latest: true });
  const videoQuery = Video.find({ latest: true });

  const songFeatures = new APIFeatures(songQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const videoFeatures = new APIFeatures(videoQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const songs = await songFeatures.query;
  const videos = await videoFeatures.query;

  const latestWork = [...songs, ...videos];

  res.status(200).json(latestWork);
});

module.exports = { getLatestWorks };
