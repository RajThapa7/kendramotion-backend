const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

const SALTROUNDS = 10; // used when hashing password

function generateAccessToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }

  if (!process.env.JWT_EXPIRES_IN) {
    throw new AppError("JWT_EXPIRES_IN is not defined", 500);
  }

  const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRES_IN,
    expiresIn: 30,
  });
  return accessToken;
}

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new AppError("Email and password is required", 400);
    return next(error);
  }

  // check if the user with that email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new AppError("User not found", 404);
    return next(error);
  }

  // compare user password with hashed password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new AppError("Incorrect password", 400);
    return next(error);
  }

  const userDetail = { name: user.name, email: user.email, role: user.role };

  const accessToken = generateAccessToken(userDetail);

  res.json({ accessToken });
});

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const role = req.query.role || "user";

  if (!name || !email || !password) {
    const error = new AppError("Name, email and password is required", 400);
    return next(error);
  }

  // check if the user already exists
  const user = await User.findOne({ email });
  if (user) {
    const error = new AppError("User already exists", 400);
    return next(error);
  }

  // check if the password is a strong password
  // const isStrongPassword = validator.isStrongPassword(password);

  const hashedPassword = await bcrypt.hash(password, SALTROUNDS);

  await User.create({ name, email, password: hashedPassword, role });

  res.status(201).json({ status: "success", message: "User Registered" });
});

module.exports = { login, register };
