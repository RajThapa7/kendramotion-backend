const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  name: String,
  url: String,
  position: Number,
  latest: {
    type: Boolean,
    default: false,
  },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtistProfile",
    },
  ],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
