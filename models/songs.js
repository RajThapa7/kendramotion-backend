

const songSchema = new mongoose.Schema({
    title: String,
    name: String,
    url: String,
    thumbImage: String,
    position: Number,
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtistProfile',
    },
  });

  module.exports = songSchema; 