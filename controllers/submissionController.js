const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Submission = require("../models/submissionModel");
const APIFeatures = require("../utils/apiFeatures");

const createSubmission = catchAsync(async (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.phoneNumber ||
    !req.body.email ||
    !req.body.videoUrl
  ) {
    const error = new AppError("Please provide required fields", 400);
    return next(error);
  }

  await Submission.create(req.body);

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
    .limitFields()
    .paginate();

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

const deleteSubmission = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  await Submission.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

module.exports = {
  createSubmission,
  getAllSubmissions,
  getSubmission,
  deleteSubmission,
};
