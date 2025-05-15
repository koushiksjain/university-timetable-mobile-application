// models/Department.model.js
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  description: {
    type: String
  },
  establishedDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);