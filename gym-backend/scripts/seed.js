const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Class = require('../models/Class');
const Payment = require('../models/Payment');
const Workout = require('../models/Workout');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Class.deleteMany();
    await Payment.deleteMany();
    await Workout.deleteMany();

    // Create admin
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@gym.com',
      password: 'admin123',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      emergencyContact: '0987654321',
      role: 'admin',
      membershipPlan: 'VIP',
      membershipStatus: 'Active'
    });

    // Create trainers
    console.log('🏋️ Creating trainers...');
    const trainer1 = await User.create({
      fullName: 'John Smith',
      email: 'john@gym.com',
      password: 'trainer123',
      phone: '1234567891',
      dateOfBirth: '1988-05-15',
      emergencyContact: '0987654322',
      role: 'trainer',
      membershipPlan: 'VIP',
      membershipStatus: 'Active',
      specialization: ['Strength Training', 'CrossFit', 'Bodybuilding'],
      bio: 'Certified personal trainer with 10+ years of experience in strength and conditioning',
      certifications: ['ACE Certified', 'CrossFit Level 2', 'Nutrition Specialist']
    });

    const trainer2 = await User.create({
      fullName: 'Sarah Williams',
      email: 'sarah@gym.com',
      password: 'trainer123',
      phone: '1234567892',
      dateOfBirth: '1992-08-20',
      emergencyContact: '0987654323',
      role: 'trainer',
      membershipPlan: 'VIP',
      membershipStatus: 'Active',
      specialization: ['Yoga', 'Pilates', 'Meditation'],
      bio: 'Yoga instructor and wellness coach specializing in mindful movement',
      certifications: ['RYT 500', 'Pilates Mat Certified', 'Meditation Teacher']
    });

    const trainer3 = await User.create({
      fullName: 'Mike Johnson',
      email: 'mike@gym.com',
      password: 'trainer123',
      phone: '1234567893',
      dateOfBirth: '1985-03-10',
      emergencyContact: '0987654324',
      role: 'trainer',
      membershipPlan: 'VIP',
      membershipStatus: 'Active',
      specialization: ['Cardio', 'HIIT', 'Boxing'],
      bio: 'High-intensity training specialist and former professional boxer',
      certifications: ['NASM Certified', 'Boxing Coach', 'HIIT Specialist']
    });

    // Create sample members
    console.log('👥 Creating sample members...');
    const member1 = await User.create({
      fullName: 'Alice Cooper',
      email: 'alice@example.com',
      password: 'member123',
      phone: '2345678901',
      dateOfBirth: '1995-06-15',
      emergencyContact: '8765432109',
      membershipPlan: 'Premium',
      membershipStatus: 'Active'
    });

    const member2 = await User.create({
      fullName: 'Bob Davis',
      email: 'bob@example.com',
      password: 'member123',
      phone: '2345678902',
      dateOfBirth: '1990-12-20',
      emergencyContact: '8765432108',
      membershipPlan: 'Basic',
      membershipStatus: 'Active'
    });

    const member3 = await User.create({
      fullName: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'member123',
      phone: '2345678903',
      dateOfBirth: '1988-04-10',
      emergencyContact: '8765432107',
      membershipPlan: 'VIP',
      membershipStatus: 'Active'
    });

    // Create sample classes
    console.log('📅 Creating sample classes...');
    await Class.create([
      {
        name: 'Morning CrossFit',
        description: 'High-intensity CrossFit training to kickstart your day',
        trainer: trainer1._id,
        schedule: {
          dayOfWeek: 'Monday',
          startTime: '06:00',
          endTime: '07:00'
        },
        capacity: 20,
        enrolled: [member1._id, member3._id],
        category: 'CrossFit',
        difficulty: 'Advanced',
        duration: 60
      },
      {
        name: 'Yoga Flow',
        description: 'Relaxing yoga session for all skill levels',
        trainer: trainer2._id,
        schedule: {
          dayOfWeek: 'Tuesday',
          startTime: '09:00',
          endTime: '10:00'
        },
        capacity: 15,
        enrolled: [member1._id, member2._id],
        category: 'Yoga',
        difficulty: 'Beginner',
        duration: 60
      },
      {
        name: 'HIIT Cardio',
        description: 'Intense cardio workout to burn maximum calories',
        trainer: trainer3._id,
        schedule: {
          dayOfWeek: 'Wednesday',
          startTime: '18:00',
          endTime: '19:00'
        },
        capacity: 25,
        enrolled: [member2._id, member3._id],
        category: 'Cardio',
        difficulty: 'Intermediate',
        duration: 60
      },
      {
        name: 'Strength & Conditioning',
        description: 'Build muscle and increase strength',
        trainer: trainer1._id,
        schedule: {
          dayOfWeek: 'Thursday',
          startTime: '17:00',
          endTime: '18:30'
        },
        capacity: 18,
        enrolled: [member3._id],
        category: 'Strength',
        difficulty: 'Intermediate',
        duration: 90
      },
      {
        name: 'Pilates Core',
        description: 'Strengthen your core with Pilates',
        trainer: trainer2._id,
        schedule: {
          dayOfWeek: 'Friday',
          startTime: '10:00',
          endTime: '11:00'
        },
        capacity: 12,
        enrolled: [member1._id],
        category: 'Pilates',
        difficulty: 'Beginner',
        duration: 60
      },
      {
        name: 'Boxing Fundamentals',
        description: 'Learn boxing techniques and get a great workout',
        trainer: trainer3._id,
        schedule: {
          dayOfWeek: 'Saturday',
          startTime: '11:00',
          endTime: '12:30'
        },
        capacity: 16,
        enrolled: [],
        category: 'Boxing',
        difficulty: 'Beginner',
        duration: 90
      }
    ]);

    // Create sample payments
    console.log('💳 Creating sample payments...');
    await Payment.create([
      {
        user: member1._id,
        amount: 49.99,
        plan: 'Premium',
        status: 'Completed',
        paymentMethod: 'Card',
        description: 'Monthly membership - Premium'
      },
      {
        user: member2._id,
        amount: 29.99,
        plan: 'Basic',
        status: 'Completed',
        paymentMethod: 'Cash',
        description: 'Monthly membership - Basic'
      },
      {
        user: member3._id,
        amount: 79.99,
        plan: 'VIP',
        status: 'Completed',
        paymentMethod: 'Online',
        description: 'Monthly membership - VIP'
      }
    ]);

    // Create sample workouts
    console.log('💪 Creating sample workouts...');
    await Workout.create([
      {
        user: member1._id,
        trainer: trainer1._id,
        name: 'Upper Body Strength',
        description: 'Focus on building upper body strength',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 seconds' },
          { name: 'Pull-ups', sets: 3, reps: '10-12', rest: '60 seconds' },
          { name: 'Shoulder Press', sets: 3, reps: '10', rest: '60 seconds' },
          { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45 seconds' }
        ],
        dayOfWeek: 'Monday',
        category: 'Strength',
        difficulty: 'Intermediate',
        estimatedDuration: 60
      },
      {
        user: member2._id,
        trainer: trainer2._id,
        name: 'Yoga Beginner Flow',
        description: 'Gentle yoga routine for beginners',
        exercises: [
          { name: 'Sun Salutation', sets: 5, reps: '1', rest: '30 seconds' },
          { name: 'Warrior Poses', sets: 3, reps: '5 breaths each side', rest: '30 seconds' },
          { name: 'Child\'s Pose', sets: 1, reps: '2 minutes', rest: 'N/A' }
        ],
        dayOfWeek: 'Tuesday',
        category: 'Flexibility',
        difficulty: 'Beginner',
        estimatedDuration: 45
      },
      {
        user: member3._id,
        trainer: trainer3._id,
        name: 'HIIT Fat Burner',
        description: 'High intensity interval training',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '15', rest: '30 seconds' },
          { name: 'Mountain Climbers', sets: 4, reps: '30', rest: '30 seconds' },
          { name: 'Jump Squats', sets: 4, reps: '20', rest: '30 seconds' },
          { name: 'High Knees', sets: 4, reps: '45 seconds', rest: '30 seconds' }
        ],
        dayOfWeek: 'Wednesday',
        category: 'Cardio',
        difficulty: 'Advanced',
        estimatedDuration: 30
      }
    ]);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin:   admin@gym.com / admin123');
    console.log('🏋️  Trainer: john@gym.com  / trainer123');
    console.log('🏋️  Trainer: sarah@gym.com / trainer123');
    console.log('🏋️  Trainer: mike@gym.com  / trainer123');
    console.log('👤 Member:  alice@example.com / member123');
    console.log('👤 Member:  bob@example.com   / member123');
    console.log('👤 Member:  charlie@example.com / member123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();