require("dotenv").config();
const app = require("./app");
const cloudinary = require("cloudinary").v2;

const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception. Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error while connecting to the database");
  });

// initialize the express server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection. Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
