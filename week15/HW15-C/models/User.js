const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null,
      index: true,
      sparse: true
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      required: true,
      default: 'local'
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!this.password) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
