const express = require('express');
const router = express.Router();
const {
  getAllTrainers,
  getTrainer,
  updateTrainerProfile
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllTrainers);
router.get('/:id', getTrainer);

router.use(protect);
router.put('/:id', authorize('trainer', 'admin'), updateTrainerProfile);

module.exports = router;