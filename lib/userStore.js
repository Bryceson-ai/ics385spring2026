const bcrypt = require('bcrypt');
const User = require('../models/User');

const memoryUsers = [];
let memoryCounter = 1;

function useMemoryStore() {
  return process.env.NODE_ENV === 'test' || process.env.USE_IN_MEMORY_DB === 'true';
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function cloneMemoryUser(record) {
  if (!record) {
    return null;
  }

  return {
    ...record,
    id: record.id,
    async comparePassword(candidatePassword) {
      if (!record.password) {
        return false;
      }

      return bcrypt.compare(candidatePassword, record.password);
    }
  };
}

async function findByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (useMemoryStore()) {
    return cloneMemoryUser(memoryUsers.find((user) => user.email === normalizedEmail));
  }

  return User.findOne({ email: normalizedEmail });
}

async function findByGoogleId(googleId) {
  if (useMemoryStore()) {
    return cloneMemoryUser(memoryUsers.find((user) => user.googleId === googleId));
  }

  return User.findOne({ googleId });
}

async function findById(id) {
  if (useMemoryStore()) {
    return cloneMemoryUser(memoryUsers.find((user) => user.id === String(id)));
  }

  return User.findById(id);
}

async function createLocalUser({ email, displayName, password, role = 'admin' }) {
  const normalizedEmail = normalizeEmail(email);

  if (useMemoryStore()) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: String(memoryCounter++),
      email: normalizedEmail,
      displayName,
      password: hashedPassword,
      googleId: null,
      provider: 'local',
      role,
      createdAt: new Date()
    };

    memoryUsers.push(user);
    return cloneMemoryUser(user);
  }

  const user = new User({
    email: normalizedEmail,
    displayName,
    password,
    provider: 'local',
    role
  });

  await user.save();
  return user;
}

async function findOrLinkOrCreateGoogleUser({ googleId, email, displayName }) {
  const normalizedEmail = normalizeEmail(email);

  let user = await findByGoogleId(googleId);
  if (user) {
    return user;
  }

  if (normalizedEmail) {
    user = await findByEmail(normalizedEmail);
    if (user) {
      if (useMemoryStore()) {
        const existing = memoryUsers.find((record) => record.id === user.id);
        existing.googleId = googleId;
        existing.provider = 'google';
        existing.displayName = displayName || existing.displayName;
        return cloneMemoryUser(existing);
      }

      user.googleId = googleId;
      user.provider = 'google';
      user.displayName = displayName || user.displayName;
      await user.save();
      return user;
    }
  }

  if (useMemoryStore()) {
    const created = {
      id: String(memoryCounter++),
      email: normalizedEmail,
      displayName: displayName || normalizedEmail || 'Google User',
      password: null,
      googleId,
      provider: 'google',
      role: 'admin',
      createdAt: new Date()
    };

    memoryUsers.push(created);
    return cloneMemoryUser(created);
  }

  const created = new User({
    email: normalizedEmail,
    displayName: displayName || normalizedEmail || 'Google User',
    googleId,
    provider: 'google',
    password: null,
    role: 'admin'
  });

  await created.save();
  return created;
}

async function clearMemoryUsers() {
  memoryUsers.length = 0;
  memoryCounter = 1;
}

async function listMemoryUsers() {
  return memoryUsers.map((user) => ({ ...user }));
}

module.exports = {
  clearMemoryUsers,
  createLocalUser,
  findByEmail,
  findByGoogleId,
  findById,
  findOrLinkOrCreateGoogleUser,
  listMemoryUsers,
  normalizeEmail,
  useMemoryStore
};
