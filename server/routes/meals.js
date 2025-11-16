const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/auth');

// @route   GET /api/meals
// @desc    Get all meals for logged in user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    
    let query = { userId: req.user.id };

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by meal type
    if (mealType) {
      query.mealType = mealType;
    }

    const meals = await Meal.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/meals/:id
// @desc    Get single meal
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Make sure user owns meal
    if (meal.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meal'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/meals
// @desc    Create new meal
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/meals/:id
// @desc    Update meal
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Make sure user owns meal
    if (meal.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal'
      });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete meal
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Make sure user owns meal
    if (meal.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal'
      });
    }

    await meal.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
