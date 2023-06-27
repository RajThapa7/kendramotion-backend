const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary").v2;

const deleteImage = catchAsync(async (req, res, next) => {
  const publicId = req.query.publicId;

  if (!publicId) {
    const err = new AppError("Public id is required", 400);
    return next(err);
  }

  await cloudinary.uploader.destroy(publicId);

  res.status(204).json();
});

module.exports = { deleteImage };
