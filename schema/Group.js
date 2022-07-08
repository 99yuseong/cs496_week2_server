const { Long } = require('mongodb');
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: Long,
  name: String,
  member: [Long]
});

module.exports = mongoose.model('Group', groupSchema);