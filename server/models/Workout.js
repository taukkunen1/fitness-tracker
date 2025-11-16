const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other']
  },
  name: {
    type: String,
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    duration: Number,
    notes: String
  }],
  duration: Number, // in minutes
  caloriesBurned: Number,
  notes: String,
  template: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
