const mongoose = require('mongoose');

const workUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['education', 'food', 'medical', 'emergency', 'marriage', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
workUpdateSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('WorkUpdate', workUpdateSchema);