const catchAsync = require("../utils/catchAsync");
const Feedback = require("../models/feedbackModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const getFeedbacks = catchAsync(async (req, res) => {
  const feedbackQuery = Feedback.find();

  const features = new APIFeatures(feedbackQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const feedbacks = await features.query;

  res.status(200).json(feedbacks);
});

const createFeedback = catchAsync(async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.feedback) {
    const error = new AppError("Missing required fields", 400);
    return next(error);
  }

  const { name, email, feedback } = req.body;

  await Feedback.create({ name, email, feedback });

  res.status(201).json();
});

const getFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Id is required", 400);
    return next(error);
  }

  const { id } = req.params;

  const feedback = await Feedback.findById(id);

  res.status(200).json(feedback);
});

const deleteFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const error = new AppError("Id is required", 400);
    return next(error);
  }

  const { id } = req.params;

  await Feedback.findByIdAndDelete(id);

  res.status(204).json();
});

module.exports = { createFeedback, getFeedbacks, getFeedback, deleteFeedback };
