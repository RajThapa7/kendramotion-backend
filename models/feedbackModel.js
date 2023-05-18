const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  feedback: {
    type: String,
    required: [true, "Feedback is required"],
  },
});

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;
