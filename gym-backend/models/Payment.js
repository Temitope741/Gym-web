const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required']
  },
  plan: {
    type: String,
    required: [true, 'Membership plan is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Online'],
    default: 'Cash'
  },
  transactionId: {
    type: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  invoiceNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
paymentSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);