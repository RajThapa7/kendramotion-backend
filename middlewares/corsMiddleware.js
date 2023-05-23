const cors = require("cors");
const AppError = require("../utils/appError");

function corsMiddleware() {
  const origin = process.env.CLIENT_URL;
  if (!origin) {
    throw new AppError("CLIENT_URL not defined", 500);
  }

  const corsOptions = {
    origin,
    optionsSuccessStatus: 200,
  };

  return cors(corsOptions);
}

module.exports = corsMiddleware;
