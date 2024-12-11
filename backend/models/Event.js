const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Event ID
  title: { type: String, required: true }, // English title (<titlee>)
  dateTime: { type: String, required: true }, // Date and time in English (<predateE>)
  duration: { type: String, required: true }, // Duration in English (<progtimee>)
  venueId: { type: String, required: true }, // Venue ID (<venueid>)
  description: { type: String, required: true }, // Description in English (<desce>)
  presenter: { type: String, required: true }, // Presenter in English (<presenterorge>)
});

module.exports = mongoose.model('Event', eventSchema);
