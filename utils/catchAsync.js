// Function wrapper to catch errors in async functions
const catchAsync = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch((error) => next(error));
  };
};

module.exports = catchAsync;
