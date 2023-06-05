const cors = require("cors");
const AppError = require("../utils/appError");

const origin1 = process.env.CLIENT_URL1;
const origin2 = process.env.CLIENT_URL2;

const whitelist = [origin1, origin2];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

function corsMiddleware() {
  if (!origin1 || !origin2) {
    throw new AppError("CLIENT_URL not defined", 500);
  }

  return cors(corsOptions);
}

module.exports = corsMiddleware;
