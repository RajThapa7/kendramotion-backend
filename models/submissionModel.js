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
  videoUrl: {
    type: String,
    required: [true, "Please provide a video url"],
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
