const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./server/models/User');
const Workout = require('./server/models/Workout');
const Meal = require('./server/models/Meal');
const Metrics = require('./server/models/Metrics');
const ProgressPhoto = require('./server/models/ProgressPhoto');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@fitness-tracker.com',
    password: 'Admin123!', // Will be hashed by the model
    role: 'admin',
    profile: {
      age: 30,
      weight: 75,
      height: 175,
      gender: 'male',
      goals: 'Maintain fitness and build strength'
    }
  },
  {
    username: 'demo',
    email: 'demo@fitness-tracker.com',
    password: 'Demo123!', // Will be hashed by the model
    role: 'user',
    profile: {
      age: 25,
      weight: 65,
      height: 168,
      gender: 'female',
      goals: 'Weight loss and improved cardio'
    }
  }
];

const sampleWorkouts = [
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'strength',
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 60, notes: 'Good form' },
      { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, notes: 'Bodyweight' },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 30, notes: '' }
    ],
    duration: 60,
    caloriesBurned: 350,
    notes: 'Felt strong today'
  },
  {
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'cardio',
    name: 'Morning Run',
    exercises: [
      { name: 'Running', duration: 30, notes: '5km completed' }
    ],
    duration: 30,
    caloriesBurned: 300,
    notes: 'Beautiful weather'
  }
];

const sampleMeals = [
  {
    date: new Date(),
    mealType: 'breakfast',
    foods: [
      { name: 'Oatmeal', quantity: 100, unit: 'g', calories: 380, protein: 13, carbs: 68, fat: 7 },
      { name: 'Banana', quantity: 1, unit: 'piece', calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: 'Almonds', quantity: 30, unit: 'g', calories: 170, protein: 6, carbs: 6, fat: 15 }
    ],
    notes: 'Healthy start to the day'
  },
  {
    date: new Date(),
    mealType: 'lunch',
    foods: [
      { name: 'Grilled Chicken', quantity: 150, unit: 'g', calories: 240, protein: 46, carbs: 0, fat: 5 },
      { name: 'Brown Rice', quantity: 150, unit: 'g', calories: 170, protein: 4, carbs: 36, fat: 1 },
      { name: 'Broccoli', quantity: 100, unit: 'g', calories: 35, protein: 3, carbs: 7, fat: 0 }
    ],
    notes: 'Post-workout meal'
  }
];

const sampleMetrics = [
  {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    weight: 75,
    bodyFat: 15,
    muscleMass: 64,
    bmi: 24.5,
    notes: 'Week 1'
  },
  {
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    weight: 76,
    bodyFat: 16,
    muscleMass: 63,
    bmi: 24.8,
    notes: 'Starting point'
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});
    await Metrics.deleteMany({});
    await ProgressPhoto.deleteMany({});
    console.log('✅ Database cleared');

    // Create users
    console.log('\n👥 Creating users...');
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create workouts for first user
    console.log('\n🏋️ Creating workouts...');
    const workoutsWithUser = sampleWorkouts.map(workout => ({
      ...workout,
      userId: users[0]._id
    }));
    const workouts = await Workout.create(workoutsWithUser);
    console.log(`✅ Created ${workouts.length} workouts`);

    // Create meals for first user
    console.log('\n🍽️ Creating meals...');
    const mealsWithUser = sampleMeals.map(meal => ({
      ...meal,
      userId: users[0]._id
    }));
    const meals = await Meal.create(mealsWithUser);
    console.log(`✅ Created ${meals.length} meals`);

    // Create metrics for first user
    console.log('\n📊 Creating metrics...');
    const metricsWithUser = sampleMetrics.map(metric => ({
      ...metric,
      userId: users[0]._id
    }));
    const metrics = await Metrics.create(metricsWithUser);
    console.log(`✅ Created ${metrics.length} metric entries`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database seeded successfully!');
    console.log('='.repeat(50));
    console.log('\n📝 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Workouts: ${workouts.length}`);
    console.log(`   Meals: ${meals.length}`);
    console.log(`   Metrics: ${metrics.length}`);
    console.log('\n👤 Sample Accounts:');
    console.log('   Admin:');
    console.log('     Username: admin');
    console.log('     Password: Admin123!');
    console.log('   Demo User:');
    console.log('     Username: demo');
    console.log('     Password: Demo123!');
    console.log('\n🎉 You can now start the backend and login!');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

// Run the seed function
seedDatabase();
