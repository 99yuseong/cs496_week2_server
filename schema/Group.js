const { Long } = require('mongodb');
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: String,
  member: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

module.exports = mongoose.model('Group', groupSchema);