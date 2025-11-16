const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { protect } = require('../middleware/auth');

// @route   GET /api/workouts
// @desc    Get all workouts for logged in user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = { userId: req.user.id };

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const workouts = await Workout.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Make sure user owns workout
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workout'
      });
    }

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/workouts
// @desc    Create new workout
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    const workout = await Workout.create(req.body);

    res.status(201).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Make sure user owns workout
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Make sure user owns workout
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    await workout.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
