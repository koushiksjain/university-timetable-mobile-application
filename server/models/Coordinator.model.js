// models/Coordinator.model.js
const mongoose = require('mongoose');
const User = require('./User.model');

const CoordinatorSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    unique: true
  },
  isHod: {
    type: Boolean,
    default: false
  },
  academicYear: {
    type: String,
    required: true
  }
});

module.exports = User.discriminator('coordinator', CoordinatorSchema);