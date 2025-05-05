// models/Class.model.js
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  room: {
    type: String
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  period: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  duration: {
    type: Number,
    default: 1,
    min: 1,
    max: 2
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String
  }
}, { timestamps: true });

// Prevent duplicate class slots
ClassSchema.index(
  { department: 1, semester: 1, section: 1, day: 1, period: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('Class', ClassSchema);