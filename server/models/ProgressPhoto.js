const mongoose = require('mongoose');

const progressPhotoSchema = new mongoose.Schema({
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
  photoUrl: {
    type: String,
    required: true
  },
  weight: Number,
  bodyFat: Number,
  notes: String,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressPhoto', progressPhotoSchema);
