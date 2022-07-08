const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {type:Number},
  name: {type:String},
  imgUrl : {type :String},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
  group: [{
    name : {type : String},
    member : {type: mongoose.Schema.Types.ObjectId, ref: "user"}
  }],
  running: [{
    datetime: { type:Date, default: Date.now },
    coordinate: [{ type: Number, type: Number }]
  }]
});

module.exports = mongoose.model('User', userSchema);