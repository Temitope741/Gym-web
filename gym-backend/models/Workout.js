const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: String,
    required: true
  },
  rest: {
    type: String // e.g., "60 seconds"
  },
  notes: {
    type: String
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Workout name is required']
  },
  description: {
    type: String
  },
  exercises: [exerciseSchema],
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  category: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'Endurance', 'Mixed'],
    default: 'Mixed'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedDuration: {
    type: Number // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedDates: [{
    type: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);