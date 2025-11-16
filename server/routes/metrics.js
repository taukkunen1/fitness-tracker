const express = require('express');
const router = express.Router();
const Metrics = require('../models/Metrics');
const { protect } = require('../middleware/auth');

// @route   GET /api/metrics
// @desc    Get all metrics for logged in user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user.id };

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const metrics = await Metrics.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/metrics
// @desc    Create new metric entry
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    const metric = await Metrics.create(req.body);

    res.status(201).json({
      success: true,
      data: metric
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/metrics/:id
// @desc    Delete metric entry
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const metric = await Metrics.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Metric not found'
      });
    }

    // Make sure user owns metric
    if (metric.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this metric'
      });
    }

    await metric.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
