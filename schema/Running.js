const mongoose = require('mongoose');

const runningSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    startDate: { type:Date, default: Date.now },
    endDate: { type:Date, default: Date.now },
    path: [{latitude: {type:Number}, longitude: {type:Number}}],
    time: Number,
    dist: Number,
    avgPace: Number,
    subDist: [Number]
})

module.exports = mongoose.model('Running', runningSchema);