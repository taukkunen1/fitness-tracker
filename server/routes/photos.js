const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProgressPhoto = require('../models/ProgressPhoto');
const { protect } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/photos
// @desc    Get all progress photos for logged in user
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

    const photos = await ProgressPhoto.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/photos
// @desc    Upload progress photo
// @access  Private
router.post('/', protect, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo'
      });
    }

    const photoData = {
      userId: req.user.id,
      photoUrl: `/uploads/${req.file.filename}`,
      date: req.body.date || Date.now(),
      weight: req.body.weight,
      bodyFat: req.body.bodyFat,
      notes: req.body.notes,
      measurements: req.body.measurements ? JSON.parse(req.body.measurements) : {}
    };

    const photo = await ProgressPhoto.create(photoData);

    res.status(201).json({
      success: true,
      data: photo
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete progress photo
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const photo = await ProgressPhoto.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Make sure user owns photo
    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this photo'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../..', photo.photoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await photo.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
