const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    _stravaID: {
        type: Number,
        required: true
    },
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
}, { writeConcern: {
    j: true,
    wtimeout: 1000
  }}
)

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;