const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  enrollClass,
  unenrollClass
} = require('../controllers/classController');
const { protect, authorize, checkMembership } = require('../middleware/auth');

router.get('/', getAllClasses);
router.get('/:id', getClass);

router.use(protect);

router.post('/', authorize('admin', 'trainer'), createClass);
router.put('/:id', authorize('admin', 'trainer'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

router.post('/:id/enroll', checkMembership, enrollClass);
router.delete('/:id/unenroll', unenrollClass);

module.exports = router;