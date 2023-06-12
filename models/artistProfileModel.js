const mongoose = require("mongoose");

const artistProfileSchema = new mongoose.Schema({
  name: String,
  profileImage: String,
  position: Number,
  designation: String,
  latestRelease: {
    movies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Movie",
    },
    songs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Video",
    },
  },
});

const ArtistProfile = mongoose.model("ArtistProfile", artistProfileSchema);

module.exports = ArtistProfile;
