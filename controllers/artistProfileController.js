const ArtistProfile = require("../models/artistProfileModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getArtistProfiles = catchAsync(async (req, res) => {
  const artistProfileQuery = ArtistProfile.find()
    .populate("latestRelease.movies")
    .populate("latestRelease.songs");

  const features = new APIFeatures(artistProfileQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const artistProfiles = await features.query;

  res.status(200).json(artistProfiles);
});

const getArtistLatestReleases = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;
  let artist = await ArtistProfile.findById(id)
    .populate("latestRelease.songs")
    .populate("latestRelease.movies");

  const latestMovies = artist.latestRelease.movies.filter(
    (movie) => movie.latest === true
  );
  const latestSongs = artist.latestRelease.songs.filter(
    (song) => song.latest === true
  );

  artist.latestRelease.movies = latestMovies;
  artist.latestRelease.songs = latestSongs;

  const latestRelease = { movies: latestMovies, songs: latestSongs };

  res.status(200).json(latestRelease);
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

  res.status(201).json({
    status: "success",
    message: "Artist profile created successfully",
  });
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

const getArtistProfile = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  const artistProfile = await ArtistProfile.findById(id);

  res.status(200).json(artistProfile);
});

module.exports = {
  getArtistProfiles,
  createArtistProfile,
  deleteArtistProfile,
  updateArtistProfile,
  getArtistProfile,
  getArtistLatestReleases,
};
