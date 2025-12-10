const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Class description is required']
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Trainer is required']
  },
  schedule: {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Class capacity is required'],
    min: 1
  },
  enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    enum: ['Cardio', 'Strength', 'Yoga', 'CrossFit', 'Pilates', 'Cycling', 'Dance', 'Boxing', 'Other'],
    default: 'Other'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Virtual for available spots
classSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.enrolled.length;
});

// Ensure virtuals are included in JSON
classSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Class', classSchema);