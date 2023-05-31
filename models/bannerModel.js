const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Banner title is required"],
  },
  name: {
    type: String,
    required: [true, "Banner name is required"],
  },
  url: {
    type: String,
    required: [true, "Banner url is required"],
  },
  type: {
    type: String,
    required: [true, "Banner type is required"],
  },
  size: {
    type: Number,
    required: [true, "Banner size is required"],
  },
});

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
