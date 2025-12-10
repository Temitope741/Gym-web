const express = require('express');
const router = express.Router();
const {
  getUserWorkouts,
  createWorkout,
  updateWorkout,
  completeWorkout
} = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my-workouts', getUserWorkouts);
router.post('/', authorize('trainer', 'admin'), createWorkout);
router.put('/:id', updateWorkout);
router.post('/:id/complete', completeWorkout);

module.exports = router;