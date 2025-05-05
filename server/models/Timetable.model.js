// models/Timetable.model.js
const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
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
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  academicYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'published'],
    default: 'draft'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coordinator'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  version: {
    type: Number,
    default: 1
  },
  isCurrent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure only one current timetable per department/semester/section
TimetableSchema.index(
  { department: 1, semester: 1, section: 1, isCurrent: 1 }, 
  { unique: true, partialFilterExpression: { isCurrent: true } }
);

module.exports = mongoose.model('Timetable', TimetableSchema);