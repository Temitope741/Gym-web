const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  duration: {
    type: Number // in minutes
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate duration on checkout
attendanceSchema.pre('save', function(next) {
  if (this.checkOutTime && this.checkInTime) {
    const diff = this.checkOutTime - this.checkInTime;
    this.duration = Math.floor(diff / 60000); // convert to minutes
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);