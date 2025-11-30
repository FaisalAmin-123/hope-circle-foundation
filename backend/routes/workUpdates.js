const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const WorkUpdate = require('../models/WorkUpdate');
// const auth = require('../middleware/auth');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'hope-circle/work-updates',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo ? ['mp4', 'mov', 'avi'] : ['jpg', 'png', 'jpeg', 'webp'],
      transformation: isVideo ? null : [{ width: 1200, height: 800, crop: 'limit' }]
    };
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'image/webp', 
      'video/mp4', 
      'video/quicktime', 
      'video/x-msvideo'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// PUBLIC ROUTES

// Get all active work updates (for homepage)
router.get('/public/work-updates', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const workUpdates = await WorkUpdate.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-createdBy -__v');

    const total = await WorkUpdate.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: workUpdates,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching work updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching work updates'
    });
  }
});

// ADMIN ROUTES (Protected)

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Get all work updates (admin)
router.get('/admin/work-updates', protect, authorize('admin'), async (req, res) => {

  try {
    const workUpdates = await WorkUpdate.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: workUpdates
    });
  } catch (error) {
    console.error('Error fetching work updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching work updates'
    });
  }
});

// Create new work update
router.post('/admin/work-updates', protect, authorize('admin'), upload.single('media'), async (req, res) => {
  try {
    const { title, description, impact, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Media file is required'
      });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    const workUpdate = new WorkUpdate({
      title,
      description,
      impact,
      category,
      mediaType,
      mediaUrl: req.file.path,
      createdBy: req.user.id
    });

    await workUpdate.save();

    res.status(201).json({
      success: true,
      message: 'Work update created successfully',
      data: workUpdate
    });
  } catch (error) {
    console.error('Error creating work update:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating work update',
      error: error.message
    });
  }
});

// Update work update
router.put('/admin/work-updates/:id', protect, authorize('admin'), upload.single('media'), async (req, res) => {
  try {
    const { title, description, impact, category, isActive } = req.body;
    
    const workUpdate = await WorkUpdate.findById(req.params.id);
    
    if (!workUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Work update not found'
      });
    }

    // Update fields
    if (title) workUpdate.title = title;
    if (description) workUpdate.description = description;
    if (impact) workUpdate.impact = impact;
    if (category) workUpdate.category = category;
    if (typeof isActive !== 'undefined') workUpdate.isActive = isActive;

    // If new media uploaded, delete old and update
    if (req.file) {
      // Delete old media from Cloudinary
      try {
        const publicId = workUpdate.mediaUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: workUpdate.mediaType });
      } catch (err) {
        console.log('Error deleting old media:', err);
      }

      workUpdate.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      workUpdate.mediaUrl = req.file.path;
    }

    await workUpdate.save();

    res.json({
      success: true,
      message: 'Work update updated successfully',
      data: workUpdate
    });
  } catch (error) {
    console.error('Error updating work update:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating work update',
      error: error.message
    });
  }
});

// Delete work update
router.delete('/admin/work-updates/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const workUpdate = await WorkUpdate.findById(req.params.id);
    
    if (!workUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Work update not found'
      });
    }

    // Delete media from Cloudinary
    try {
      const publicId = workUpdate.mediaUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: workUpdate.mediaType });
    } catch (err) {
      console.log('Error deleting media:', err);
    }

    await workUpdate.deleteOne();

    res.json({
      success: true,
      message: 'Work update deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting work update:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting work update',
      error: error.message
    });
  }
});

// Toggle active status
router.patch('/admin/work-updates/:id/toggle-active', protect, authorize('admin'), async (req, res) => {
  try {
    const workUpdate = await WorkUpdate.findById(req.params.id);
    
    if (!workUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Work update not found'
      });
    }

    workUpdate.isActive = !workUpdate.isActive;
    await workUpdate.save();

    res.json({
      success: true,
      message: `Work update ${workUpdate.isActive ? 'activated' : 'deactivated'} successfully`,
      data: workUpdate
    });
  } catch (error) {
    console.error('Error toggling work update:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling work update'
    });
  }
});

module.exports = router;