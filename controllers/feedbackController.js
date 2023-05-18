const catchAsync = require("../utils/catchAsync");
const Feedback = require("../models/feedbackModel");
const AppError = require("../utils/appError");

const createFeedback = catchAsync(async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.feedback) {
    const error = new AppError("Missing required fields", 400);
    return next(error);
  }

  const { name, email, feedback } = req.body;

  await Feedback.create({ name, email, feedback });

  res.status(201).json();
});

const getFeedbacks = catchAsync(async (req, res) => {
  const feedbacks = await Feedback.find();
  res.status(200).json(feedbacks);
});

module.exports = { createFeedback, getFeedbacks };
