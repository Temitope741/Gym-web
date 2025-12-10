const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required']
  },
  role: {
    type: String,
    enum: ['member', 'trainer', 'admin'],
    default: 'member'
  },
  membershipPlan: {
    type: String,
    enum: ['Basic', 'Premium', 'VIP'],
    default: 'Basic'
  },
  membershipStatus: {
    type: String,
    enum: ['Active', 'Expired', 'Pending'],
    default: 'Pending'
  },
  membershipExpiry: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    }
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String,
    default: ''
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Trainer specific fields
  specialization: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  certifications: {
    type: [String],
    default: []
  },
  availability: {
    type: Map,
    of: [String],
    default: {}
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model('User', userSchema);