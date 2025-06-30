const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Create admin user if none exists
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // this will be hashed by the model pre-save hook
      role: 'admin'
    });

    console.log('Admin user created:', adminUser.email);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Execute seeder
createAdminUser().then(() => {
  mongoose.connection.close();
  console.log('Seeding completed');
}); 