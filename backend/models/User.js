// backend/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean },
  favorites: { type: Array },
  bookedEvents: { type: Array },
});

module.exports = mongoose.model("User", userSchema);
