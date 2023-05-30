const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Banner name is required"],
  },
  url: {
    type: String,
    required: [true, "Banner url is required"],
  },
  publicId: {
    type: String,
    required: [true, "Banner publicId is required"],
  },
});

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
