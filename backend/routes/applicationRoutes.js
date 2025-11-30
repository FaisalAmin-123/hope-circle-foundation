const express = require('express');
const router = express.Router();

// Import controllers
const {
  submitApplication,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
} = require('../controllers/applicationController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Routes

// Submit application with documents (multiple files)
router.post(
  '/',
  protect,
  authorize('beneficiary'),
  upload.fields([
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'rationCard', maxCount: 1 },
    { name: 'incomeCertificate', maxCount: 1 },
    { name: 'medicalCertificate', maxCount: 1 },
  ]),
  submitApplication
);

// Get my application
router.get('/my-application', protect, authorize('beneficiary'), getMyApplication);

// Get all applications (Admin)
router.get('/', protect, authorize('admin'), getAllApplications);

// Get single application (Admin)
router.get('/:id', protect, authorize('admin'), getApplicationById);

// Approve application (Admin)
router.put('/:id/approve', protect, authorize('admin'), approveApplication);

// Reject application (Admin)
router.put('/:id/reject', protect, authorize('admin'), rejectApplication);

module.exports = router;