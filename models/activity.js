const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    _userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    activityID: {
        type: Number,
        required: true
    },
    activityName: {
        type: String,
        required: true
    },
    activityDistance: {
        type: Number,
        required: true
    },
    activityTime:{
        type: String,
        required: true
    },
    activityDate: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        required: true
    },
    activityTSS: {
        type: Number,
    },
    averagePace: {
        type: String,
    },
    timePerHRZone: {
        type: [Number]
    },
    timeStream: {
        type: [Number]
    },
    distanceStream: {
        type: [Number]
    },
    heartrateStream: {
        type: [Number]
    },
    paceStream: {
        type: [Number]
    },
    elevationStream: {
        type: [Number]
    },
}, { writeConcern: {
    j: true,
    wtimeout: 1000
  }}
)

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;