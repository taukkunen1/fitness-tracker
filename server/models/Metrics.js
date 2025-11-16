const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  bmi: Number,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Metrics', metricsSchema);
