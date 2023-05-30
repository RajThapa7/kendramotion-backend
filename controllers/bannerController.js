const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Banner = require("../models/bannerModel");
const APIFeatures = require("../utils/apiFeatures");

const createBanner = catchAsync(async (req, res, next) => {
  if (!req.file) {
    const error = new AppError("Please upload a file", 400);
    return next(error);
  }

  if (!req.body.name) {
    const error = new AppError("Please provide a banner name", 400);
    return next(error);
  }

  const { path, filename } = req.file;

  try {
    const response = await cloudinary.uploader.upload(path, {
      public_id: filename,
      folder: "banners",
    });

    await Banner.create({
      name: req.body.name,
      url: response.secure_url,
      publicId: response.public_id,
    });

    res.status(201).json();
  } catch (err) {
    fs.unlinkSync(path);
    const error = new AppError(err, 500);
    return next(error);
  }
});

const getBanners = catchAsync(async (req, res) => {
  const bannerQuery = Banner.find();

  const features = new APIFeatures(bannerQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const banners = await features.query;

  res.status(200).json(banners);
});

const getBanner = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Please provide a banner ID", 400);
    return next(error);
  }

  const { id } = req.params;
  const banner = await Banner.findById(id);

  if (!banner) {
    const error = new AppError("No banner found with that ID", 404);
    return next(error);
  }

  res.status(200).json(banner);
});

const deleteBanner = catchAsync(async (req, res, next) => {
  if (!req.query.public_id) {
    const error = new AppError("Please provide a public id", 400);
    return next(error);
  }

  try {
    await cloudinary.uploader.destroy(req.query.public_id);
    await Banner.deleteOne({ publicId: req.query.public_id });
    res.status(204).json();
  } catch (err) {
    const error = new AppError(err, 500);
    return next(error);
  }
});

module.exports = { createBanner, getBanners, getBanner, deleteBanner };
