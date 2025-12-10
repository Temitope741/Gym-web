const Attendance = require('../models/Attendance');

// Check in
exports.checkIn = async (req, res) => {
  try {
    const attendance = await Attendance.create({
      user: req.user.id,
      class: req.body.classId,
      notes: req.body.notes
    });
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check out
exports.checkOut = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user attendance history
exports.getUserAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id })
      .populate('class', 'name')
      .sort('-checkInTime');
    res.json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all attendance (admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('user', 'fullName email')
      .populate('class', 'name')
      .sort('-checkInTime');
    res.json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};