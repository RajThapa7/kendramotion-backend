const express = require("express");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const movieRouter = require("./routes/movieRoutes");
const songRouter = require("./routes/songRoutes");
const artistProfileRouter = require("./routes/artistProfileRoutes");

const BASE_URL = "/api/v1";

const app = express();
app.use(express.json());

app.use(`${BASE_URL}/movies`, movieRouter);
app.use(`${BASE_URL}/songs`, songRouter);
app.use(`${BASE_URL}/artist-profiles`, artistProfileRouter);

app.all("*", (req, _res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
