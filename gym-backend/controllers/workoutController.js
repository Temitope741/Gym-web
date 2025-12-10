const Workout = require('../models/Workout');

// Get user workouts
exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .populate('trainer', 'fullName');
    res.json({ success: true, count: workouts.length, workouts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create workout
exports.createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.body.userId || req.user.id,
      trainer: req.user.role === 'trainer' ? req.user.id : req.body.trainerId
    });
    res.status(201).json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update workout
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark workout as completed
exports.completeWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    workout.completedDates.push(new Date());
    await workout.save();
    
    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};