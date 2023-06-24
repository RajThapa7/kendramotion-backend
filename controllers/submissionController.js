const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Submission = require("../models/submissionModel");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { getPublicIdFromURL } = require("../utils/cloudinaryUtil");

const createSubmission = catchAsync(async (req, res, next) => {
  const wordDocument = req.files.document;
  const video = req.files.video;

  if (!wordDocument || !video || wordDocument.length < 1 || video.length < 1) {
    const error = new AppError("Word document and video file is required", 400);
    return next(error);
  }

  if (!req.body.name || !req.body.phoneNumber || !req.body.email) {
    const error = new AppError("Please provide required fields", 400);
    return next(error);
  }

  const documentPath = wordDocument[0].path;
  const documentName = wordDocument[0].filename;

  const videoPath = video[0].path;
  const videoName = video[0].filename;

  // upload video and document to the cloud
  let videoObj = {};
  let documentObj = {};

  try {
    // upload video
    const videoResponse = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      public_id: videoName,
      folder: "submissions/videos",
    });

    // upload document
    const documentResponse = await cloudinary.uploader.upload(documentPath, {
      resource_type: "raw",
      public_id: documentName,
      folder: "submissions/documents",
    });

    fs.unlinkSync(videoPath);
    fs.unlinkSync(documentPath);

    videoObj.url = videoResponse.secure_url;
    videoObj.publicId = videoResponse.public_id;

    documentObj.publicId = documentResponse.public_id;
    documentObj.url = documentResponse.secure_url;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(videoPath);
    fs.unlinkSync(documentPath);
    const error = new AppError(err, 500);
    return next(error);
  }

  await Submission.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    document: documentObj,
    video: videoObj,
  });

  res.status(201).json({
    status: "success",
    message: "Successfully created submission",
  });
});

const getAllSubmissions = catchAsync(async (req, res) => {
  const submissionQuery = Submission.find();

  const features = new APIFeatures(submissionQuery, req.query)
    .filter()
    .sort()
    .limitFields();

  const submissions = await features.query;

  res.status(200).json(submissions);
});

const getSubmission = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Please provide a submission ID", 400);
    return next(error);
  }

  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(new AppError("No submission found with that ID", 404));
  }

  res.status(200).json(submission);
});

const getDocument = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Please provide a submission ID", 400);
    return next(error);
  }

  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(new AppError("No submission found with that ID", 404));
  }

  const documentPath = submission.document.path;

  res.sendFile(documentPath);
});

const deleteSubmission = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Submission id is required", 400);
    return next(err);
  }

  const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);

  if (!deletedSubmission) {
    return next(new AppError("No submission found with that ID", 404));
  }

  await cloudinary.uploader.destroy(deletedSubmission.video.publicId, {
    resource_type: "video",
  });

  await cloudinary.uploader.destroy(deletedSubmission.document.publicId, {
    resource_type: "raw",
  });

  res.status(204).json();
});

module.exports = {
  createSubmission,
  getAllSubmissions,
  getSubmission,
  deleteSubmission,
  getDocument,
};
