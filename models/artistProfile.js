const mongoose = require('mongoose');

const artistProfileSchema = new mongoose.Schema({
    name: String,
    profileImage: String,
    designation: String,
    position: Number,
    latestRelease: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
  });

  module.exports = artistProfileSchema; 