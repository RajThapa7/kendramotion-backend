const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Banner = require("../models/bannerModel");
const APIFeatures = require("../utils/apiFeatures");
const { getPublicIdFromURL } = require("../utils/cloudinaryUtil");

const createBanner = catchAsync(async (req, res, next) => {
  const image = req.body.image;

  if (!image?.url || !image?.name || !image?.type || !image?.size) {
    const error = new AppError(
      "Please provide a url, name, type, and size",
      400
    );
    return next(error);
  }

  const roadBlock = req.body.roadBlock;

  await Banner.create({
    ...image,
    title: req.body.title,
    ...(roadBlock && { roadBlock }),
  });

  res
    .status(201)
    .json({ status: "success", message: "Banner created successfully" });
});

const getBanners = catchAsync(async (req, res) => {
  const bannerQuery = Banner.find();

  const features = new APIFeatures(bannerQuery, req.query)
    .filter()
    .sort()
    .limitFields();

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
  const publicId = getPublicIdFromURL(deletedBanner.url);

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  res.status(204).json();
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
    fs.unlinkSync(path);
    res.status(201).json({ url: response.secure_url });
  } catch (err) {
    fs.unlinkSync(path);
    const error = new AppError(err, 500);
    return next(error);
  }
});

const editBanner = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Please provide a banner id", 400);
    return next(error);
  }

  await Banner.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    message: "Banner updated successfully",
  });
});

module.exports = {
  createBanner,
  getBanners,
  getBanner,
  deleteBanner,
  uploadBanner,
  editBanner,
};
