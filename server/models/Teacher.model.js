// models/Teacher.model.js
const mongoose = require('mongoose');
const User = require('./User.model');

const TeacherSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'],
    required: true
  },
  qualifications: [{
    degree: String,
    specialization: String,
    university: String,
    year: Number
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  maxHoursPerWeek: {
    type: Number,
    default: 20
  }
});

module.exports = User.discriminator('teacher', TeacherSchema);