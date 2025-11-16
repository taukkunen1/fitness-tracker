const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
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
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  foods: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
mealSchema.pre('save', function(next) {
  if (this.foods && this.foods.length > 0) {
    this.totalCalories = this.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    this.totalProtein = this.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
    this.totalCarbs = this.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
    this.totalFat = this.foods.reduce((sum, food) => sum + (food.fat || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
