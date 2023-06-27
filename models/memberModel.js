const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  phone: String,
  name: String,
  designation: String,
  profileImage: String,
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
