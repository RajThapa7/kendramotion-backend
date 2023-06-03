const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
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

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
