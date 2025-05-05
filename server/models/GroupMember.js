// server/models/GroupMember.js
const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_task: { type: String }
});

module.exports = mongoose.model('GroupMember', groupMemberSchema);
