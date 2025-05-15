// models/Availability.model.js
const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  periods: [{
    period: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    reason: {
      type: String
    }
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);