// models/Student.model.js
const mongoose = require('mongoose');
const User = require('./User.model');

const StudentSchema = new mongoose.Schema({
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
  usn: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  section: {
    type: String,
    required: true,
    uppercase: true
  },
  batch: {
    type: Number,
    required: true
  }
});

module.exports = User.discriminator('student', StudentSchema);