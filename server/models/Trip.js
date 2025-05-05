// server/models/Trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    destination: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
});
// Speeds up Trip Report’s range query on start_date **and** filter on destination
tripSchema.index({ start_date: 1, destination: 1 });

module.exports = mongoose.model('Trip', tripSchema);
