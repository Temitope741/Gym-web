const express = require('express');
const router = express.Router();
const {
  createPayment,
  getUserPayments,
  getAllPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createPayment);
router.get('/my-payments', getUserPayments);
router.get('/all', authorize('admin'), getAllPayments);
router.get('/stats', authorize('admin'), getPaymentStats);

module.exports = router;