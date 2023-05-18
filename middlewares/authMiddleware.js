const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const verifyUser = catchAsync(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    const error = new AppError("Access token is required", 401);
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const error = new AppError("Access token is invalid", 403);
      return next(error);
    }

    req.user = user;
    next();
  });
});

module.exports = { verifyUser };
