// server/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true }
});
// Speeds up the $lookup join in the Trip Report aggregation
activitySchema.index({ trip_id: 1 });
//B-Tree index on name makes distinct query very fast
activitySchema.index({ name: 1 });

module.exports = mongoose.model('Activity', activitySchema);
