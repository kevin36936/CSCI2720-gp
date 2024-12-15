const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Venue ID
  name: { type: String, required: true }, // Venue name
  latitude: { type: Number }, // Venue latitude
  longitude: { type: Number }, // Venue longitude
  comment: { type: Array },

});

module.exports = mongoose.model("Venue", venueSchema);
