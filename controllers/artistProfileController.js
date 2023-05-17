const ArtistProfile = require("../models/artistProfileModel");
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

module.exports = { getArtistProfiles, createArtistProfile };
