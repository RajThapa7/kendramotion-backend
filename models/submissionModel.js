const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  document: {
    url: { type: String, required: [true, "Please provide a document url"] },
    publicId: {
      type: String,
      required: [true, "Please provide a document publicId"],
    },
  },
  video: {
    url: { type: String, required: [true, "Please provide a video url"] },
    publicId: {
      type: String,
      required: [true, "Please provide a video publicId"],
    },
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
