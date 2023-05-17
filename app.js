const express = require("express");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
const BASE_URL = "/api/v1";

app.use(express.json());

app.get(`${BASE_URL}/test`, (_req, res) => {
  res.json({ message: "Hello World!" });
});



app.all("*", (req, _res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
