const Class = require('../models/Class');

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('trainer', 'fullName email');
    res.json({ success: true, count: classes.length, classes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single class
exports.getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('trainer', 'fullName email')
      .populate('enrolled', 'fullName email');
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ success: true, class: classItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create class
exports.createClass = async (req, res) => {
  try {
    const classItem = await Class.create(req.body);
    res.status(201).json({ success: true, class: classItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ success: true, class: classItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ success: true, message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enroll in class
exports.enrollClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classItem.enrolled.length >= classItem.capacity) {
      return res.status(400).json({ message: 'Class is full' });
    }

    if (classItem.enrolled.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    classItem.enrolled.push(req.user.id);
    await classItem.save();

    res.json({ success: true, class: classItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unenroll from class
exports.unenrollClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classItem.enrolled = classItem.enrolled.filter(
      id => id.toString() !== req.user.id
    );
    await classItem.save();

    res.json({ success: true, class: classItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};