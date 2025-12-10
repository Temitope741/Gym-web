const User = require('../models/User');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' });
    res.json({ success: true, count: trainers.length, trainers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json({ success: true, trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update trainer profile
exports.updateTrainerProfile = async (req, res) => {
  try {
    const trainer = await User.findByIdAndUpdate(req.params.id, {
      specialization: req.body.specialization,
      bio: req.body.bio,
      certifications: req.body.certifications,
      availability: req.body.availability
    }, {
      new: true,
      runValidators: true
    });
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    res.json({ success: true, trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};