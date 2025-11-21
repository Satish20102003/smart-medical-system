import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Common fields for both roles
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['doctor', 'patient'] },

  // Doctor-specific fields (optional)
  specialization: { type: String, default: null },
  licenseNumber: { type: String, default: null },

  // Patient-specific fields (optional)
  age: { type: Number, default: null },
  gender: { type: String, enum: ['Male', 'Female', 'Other', null], default: null },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// --- Pre-save hook to hash password before saving ---
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  // Hash password with salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;