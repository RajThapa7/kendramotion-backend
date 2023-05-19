const ArtistProfile = require("../models/artistProfileModel");
const Song = require("../models/songModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getArtistProfiles = catchAsync(async (req, res) => {
  const artistProfiles = await ArtistProfile.find()
    .populate("latestRelease.movies")
    .populate("latestRelease.songs");

  res.status(200).json(artistProfiles);
});

const createArtistProfile = catchAsync(async (req, res) => {
  const { name, profileImage, designation, position, latestRelease } = req.body;

  await ArtistProfile.create({
    name,
    profileImage,
    designation,
    position,
    latestRelease,
  });

  const artistProfiles = await ArtistProfile.find();

  res.status(201).json(artistProfiles);
});

const deleteArtistProfile = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await ArtistProfile.findByIdAndDelete(id);

  res.status(204).json();
});

const updateArtistProfile = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await ArtistProfile.findByIdAndUpdate(id, req.body);

  res.status(200).json({
    status: "success",
    message: "Artist profile updated successfully",
  });
});

module.exports = {
  getArtistProfiles,
  createArtistProfile,
  deleteArtistProfile,
  updateArtistProfile,
};
