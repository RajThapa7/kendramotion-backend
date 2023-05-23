const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  name: String,
  url: String,
  position: Number,
  latest: {
    type: Boolean,
    default: false,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArtistProfile",
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
