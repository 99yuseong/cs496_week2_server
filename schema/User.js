const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {type:Number},
  name: {type:String},
  imgUrl : {type :String},
  room : {type : String},
  // invites: [{type: String}],
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  group: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}],
  running: [{type: mongoose.Schema.Types.ObjectId, ref: "Running"}]
});

module.exports = mongoose.model('User', userSchema);