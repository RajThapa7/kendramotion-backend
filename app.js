const express = require("express");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const movieRouter = require("./routes/movieRoutes");
const videoRouter = require("./routes/videoRoutes");
const songRouter = require("./routes/songRoutes");
const artistProfileRouter = require("./routes/artistProfileRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const latestWorkRouter = require("./routes/latestWorkRoutes");
const memberRouter = require("./routes/memberRoutes");
const authRouter = require("./routes/authRoutes");
const corsMiddleware = require("./middlewares/corsMiddleware");

const BASE_URL = "/api/v1";

const app = express();

app.use(corsMiddleware());
app.use(express.json());

app.use(`${BASE_URL}`, authRouter);
app.use(`${BASE_URL}/movie`, movieRouter);
app.use(`${BASE_URL}/video`, videoRouter);
app.use(`${BASE_URL}/song`, songRouter);
app.use(`${BASE_URL}/artist-profile`, artistProfileRouter);
app.use(`${BASE_URL}/feedback`, feedbackRouter);
app.use(`${BASE_URL}/latest-work`, latestWorkRouter);
app.use(`${BASE_URL}/member`, memberRouter);

app.all("*", (req, _res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
