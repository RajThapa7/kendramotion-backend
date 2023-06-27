const ArtistProfile = require("../models/artistProfileModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { getPublicIdFromURL } = require("../utils/cloudinaryUtil");

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

const createArtistProfile = catchAsync(async (req, res, next) => {
  const image = req.body.image;

  if (!image?.url) {
    const error = new AppError("Please provide an image url", 400);
    return next(error);
  }
  const { name, designation, position, latestRelease } = req.body;

  await ArtistProfile.create({
    name,
    designation,
    position,
    latestRelease,
    profileImage: image.url,
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

  const deletedArtist = await ArtistProfile.findByIdAndDelete(id);

  const publicId = getPublicIdFromURL(deletedArtist.profileImage);
  await cloudinary.uploader.destroy(publicId);

  res.status(204).json();
});

const updateArtistProfile = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const image = req.body.image;
  if (!image?.url) {
    const error = new AppError("Please provide an image url", 400);
    return next(error);
  }

  const { id } = req.params;
  const previousArtist = await ArtistProfile.findByIdAndUpdate(id, {
    ...req.body,
    profileImage: image.url,
  });

  // delete the previous image from cloudinary since new image is already uploaded
  const publicId = getPublicIdFromURL(previousArtist.profileImage);

  await cloudinary.uploader.destroy(publicId);

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

const uploadProfile = catchAsync(async (req, res, next) => {
  if (!req.file) {
    const error = new AppError("Please upload a file", 400);
    return next(error);
  }

  const { path, filename } = req.file;

  try {
    const response = await cloudinary.uploader.upload(path, {
      public_id: filename,
      folder: "profile",
    });
    fs.unlinkSync(path);

    res.status(201).json({ url: response.secure_url });
  } catch (err) {
    fs.unlinkSync(path);
    const error = new AppError(err, 500);
    return next(error);
  }
});

module.exports = {
  getArtistProfiles,
  createArtistProfile,
  deleteArtistProfile,
  updateArtistProfile,
  getArtistProfile,
  getArtistLatestReleases,
  uploadProfile,
};
