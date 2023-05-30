const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Banner = require("../models/bannerModel");

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
    });

    res.status(201).json();
  } catch (err) {
    console.log("CLOUDINARY ERROR", err);
    fs.unlinkSync(path);
    const error = new AppError(err, 500);
    return next(error);
  }
});

module.exports = { createBanner };
