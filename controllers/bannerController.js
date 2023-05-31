const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Banner = require("../models/bannerModel");
const APIFeatures = require("../utils/apiFeatures");

const createBanner = catchAsync(async (req, res, next) => {
  const image = req.body.image;

  if (!image?.url || !image?.name || !image?.type || !image?.size) {
    const error = new AppError(
      "Please provide a url, name, type, and size",
      400
    );
    return next(error);
  }

  await Banner.create({ ...image, title: req.body.title });

  res.status(201).json();
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
  if (!req.params.id) {
    const error = new AppError("Please provide a banner id", 400);
    return next(error);
  }

  const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

  const url = deletedBanner.url;
  const splitUrl = url.split("/"); // split the url into an array

  // get the publicId from the url (banners/344856823748.jpg)
  const imageId = splitUrl[splitUrl.length - 1];
  const imageFolder = splitUrl[splitUrl.length - 2];
  const publicId = `${imageFolder}/${imageId}`;

  try {
    await cloudinary.uploader.destroy(publicId || "");
    res.status(204).json();
  } catch (err) {
    const error = new AppError(err, 500);
    return next(error);
  }
});

const uploadBanner = catchAsync(async (req, res, next) => {
  if (!req.file) {
    const error = new AppError("Please upload a file", 400);
    return next(error);
  }

  const { path, filename } = req.file;

  try {
    const response = await cloudinary.uploader.upload(path, {
      public_id: filename,
      folder: "banners",
    });

    res.status(201).json({ url: response.secure_url });
  } catch (err) {
    fs.unlinkSync(path);
    const error = new AppError(err, 500);
    return next(error);
  }
});

module.exports = {
  createBanner,
  getBanners,
  getBanner,
  deleteBanner,
  uploadBanner,
};
