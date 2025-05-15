// models/Subject.model.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  hoursPerWeek: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  isLab: {
    type: Boolean,
    default: false
  },
  electiveGroup: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);