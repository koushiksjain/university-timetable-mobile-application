// models/Preference.model.js
const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  preferredDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }],
  preferredPeriods: [{
    type: Number,
    min: 1,
    max: 8
  }],
  unwantedDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }],
  unwantedPeriods: [{
    type: Number,
    min: 1,
    max: 8
  }],
  maxContinuousClasses: {
    type: Number,
    default: 2
  },
  minGapBetweenClasses: {
    type: Number,
    default: 1
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Preference', PreferenceSchema);