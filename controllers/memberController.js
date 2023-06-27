const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Member = require("../models/memberModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { getPublicIdFromURL } = require("../utils/cloudinaryUtil");

const getMembers = catchAsync(async (req, res) => {
  const memberQuery = Member.find();

  const features = new APIFeatures(memberQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  let members = await features.query;

  res.status(200).json(members);
});

const createMember = catchAsync(async (req, res, next) => {
  if (!req.body.phone || !req.body.name || !req.body.designation) {
    const error = new AppError("Please provide all the required fields", 400);
    return next(error);
  }

  const image = req.body.image;
  if (!image?.url) {
    const error = new AppError("Please provide an image url", 400);
    return next(error);
  }

  const { phone, name, designation } = req.body;

  await Member.create({ name, phone, designation, profileImage: image.url });

  res.status(201).json({ message: "Member created successfully" });
});

const deleteMember = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  const deletedMember = await Member.findByIdAndDelete(id);

  // delete the image from cloudinary
  const publicId = getPublicIdFromURL(deletedMember.profileImage);
  await cloudinary.uploader.destroy(publicId);

  res.status(204).json();
});

const updateMember = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Member.findByIdAndUpdate(id, req.body);

  res
    .status(200)
    .json({ status: "success", message: "Member updated successfully" });
});

const getMember = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  const song = await Member.findById(id);

  res.status(200).json(song);
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
      folder: "member",
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
  getMember,
  getMembers,
  createMember,
  deleteMember,
  updateMember,
  uploadProfile,
};
