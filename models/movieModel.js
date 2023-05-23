const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  name: String,
  url: String,
  position: Number,
  // TODO: multiple artists
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArtistProfile",
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
