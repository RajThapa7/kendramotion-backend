const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Member = require("../models/memberModel");

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

  await Member.create(req.body);

  res.status(201).json({ message: "Member created successfully" });
});

const deleteMember = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    const err = new AppError("Id is required", 400);
    return next(err);
  }

  const { id } = req.params;

  await Member.findByIdAndDelete(id);

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

module.exports = {
  getMember,
  getMembers,
  createMember,
  deleteMember,
  updateMember,
};
