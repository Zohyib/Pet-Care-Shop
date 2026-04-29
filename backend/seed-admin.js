const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'USER' },
  status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petcareshop');
  console.log('Connected to MongoDB');

  const adminEmail = 'admin@petcare.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  
  if (existingAdmin) {
    console.log('Admin already exists! Resetting password to admin123...');
    existingAdmin.password = await bcrypt.hash('admin123', 10);
    existingAdmin.role = 'ADMIN';
    await existingAdmin.save();
    console.log('Password reset successfully.');
  } else {
    console.log('Creating new admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN',
      status: 'ACTIVE'
    });
    console.log('Admin created successfully.');
  }

  console.log('--- Admin Credentials ---');
  console.log(`Email: ${adminEmail}`);
  console.log('Password: admin123');
  console.log('-------------------------');

  mongoose.disconnect();
}

seedAdmin().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
