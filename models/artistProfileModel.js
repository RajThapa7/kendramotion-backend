const mongoose = require("mongoose");

const artistProfileSchema = new mongoose.Schema({
  name: String,
  profileImage: String,
  designation: String,
  position: Number,
  latestRelease: {
    movies: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    songs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  },
});

const ArtistProfile = mongoose.model("ArtistProfile", artistProfileSchema);

module.exports = ArtistProfile;
