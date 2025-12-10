const Payment = require('../models/Payment');
const User = require('../models/User');

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      user: req.user.id
    });

    // Update user membership if payment is completed
    if (payment.status === 'Completed') {
      const user = await User.findById(req.user.id);
      user.membershipPlan = payment.plan;
      user.membershipStatus = 'Active';
      
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      user.membershipExpiry = expiry;
      
      await user.save();
    }

    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort('-paymentDate');
    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'fullName email')
      .sort('-paymentDate');
    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { 
        $match: { 
          status: 'Completed',
          paymentDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};