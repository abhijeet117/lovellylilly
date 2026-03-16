require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'admin@lovelylilly.ai';
    const adminPassword = 'AdminPassword123!';

    const bcrypt = require('bcryptjs');
    
    // Check if user already exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log('Admin user already exists. Updating role and password...');
      await User.collection.updateOne(
        { email: adminEmail },
        { 
          $set: { 
            role: 'admin', 
            password: await bcrypt.hash(adminPassword, 12),
            isEmailVerified: true 
          } 
        }
      );
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await User.collection.insertOne({
        name: 'LovelyLilly Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: { theme: 'dark', defaultModel: 'gpt-4o', voiceLanguage: 'en-US' },
        totalQueries: 0
      });
      console.log('Admin user created successfully.');
    }

    console.log('\n--- ADMIN CREDENTIALS ---');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-------------------------\n');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Force exit to ensure script finishes
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
