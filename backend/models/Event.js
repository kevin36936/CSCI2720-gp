const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Event ID
  title: { type: String, required: true }, // English title (<titlee>)
  dateTime: { type: String, required: true }, // Date and time in English (<predateE>)
  duration: { type: String }, // Duration in English (<progtimee>)
  venueId: { type: Number, required: true }, // Venue ID (<venueid>)
  description: { type: String }, // Description in English (<desce>)
  presenter: { type: String }, // Presenter in English (<presenterorge>)
  ageLimit: { type: String }, // Age limit (<agelimite>)
  price: { type: String }, // Price (<pricee>)
  remarks: { type: String }, // Remarks (<remarkse>)
  saleDate: { type: String }, // Sale date (<saledate>)
  submitDate: { type: String, required: true }, // Submit date (<submitdate>)
  programTime: { type: String }, // Program time (<programtime>)
  tagentUrl: { type: String }, // Tagent URL (<tagenturl>)
  url: { type: String }, // URL (<url>)
});

module.exports = mongoose.model("Event", eventSchema);
