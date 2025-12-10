const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getUserAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize, checkMembership } = require('../middleware/auth');

router.use(protect);

router.post('/checkin', checkMembership, checkIn);
router.put('/:id/checkout', checkOut);
router.get('/my-attendance', getUserAttendance);
router.get('/all', authorize('admin', 'trainer'), getAllAttendance);

module.exports = router;