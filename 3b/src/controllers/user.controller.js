const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/user.model');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = passwordHash.split(':');
  const currentHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return storedHash === currentHash;
}

function sanitizeUser(userDocument) {
  if (!userDocument) {
    return null;
  }

  if (typeof userDocument.toObject !== 'function') {
    const { passwordHash, ...user } = userDocument;
    return user;
  }

  const user = userDocument.toObject();
  delete user.passwordHash;
  return user;
}

function isMemoryMode(req) {
  return req.app.locals.databaseMode !== 'mongodb' || mongoose.connection.readyState !== 1;
}

function getMemoryUsers(req) {
  req.app.locals.memoryUsers = req.app.locals.memoryUsers || [];
  return req.app.locals.memoryUsers;
}

exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, rollNo, course, password } = req.body;

    if (!fullName || !email || !phone || !rollNo || !password) {
      return res.status(400).json({
        message: 'fullName, email, phone, rollNo, and password are required.'
      });
    }

    if (isMemoryMode(req)) {
      const users = getMemoryUsers(req);
      const existingUser = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return res.status(409).json({
          message: 'A user with this email already exists.'
        });
      }

      const user = {
        _id: `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fullName,
        email: email.toLowerCase(),
        phone,
        rollNo,
        course: course || 'TE Information Technology',
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.unshift(user);

      return res.status(201).json({
        message: 'User registered successfully in memory demo mode.',
        user: sanitizeUser(user)
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'A user with this email already exists.'
      });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      rollNo,
      course,
      passwordHash: hashPassword(password)
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    if (isMemoryMode(req)) {
      const user = getMemoryUsers(req).find(
        (entry) => entry.email.toLowerCase() === email.toLowerCase()
      );

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({
          message: 'Invalid email or password.'
        });
      }

      return res.json({
        message: 'Login successful in memory demo mode.',
        user: sanitizeUser(user)
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    return res.json({
      message: 'Login successful.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (isMemoryMode(req)) {
      return res.json(getMemoryUsers(req).map(sanitizeUser));
    }

    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users.map(sanitizeUser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (isMemoryMode(req)) {
      const user = getMemoryUsers(req).find(
        (entry) => String(entry._id) === String(req.params.id)
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.json(sanitizeUser(user));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.passwordHash = hashPassword(updateData.password);
      delete updateData.password;
    }

    if (isMemoryMode(req)) {
      const users = getMemoryUsers(req);
      const userIndex = users.findIndex(
        (entry) => String(entry._id) === String(req.params.id)
      );

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return res.json({
        message: 'User updated successfully in memory demo mode.',
        user: sanitizeUser(users[userIndex])
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      message: 'User updated successfully.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (isMemoryMode(req)) {
      const users = getMemoryUsers(req);
      const userIndex = users.findIndex(
        (entry) => String(entry._id) === String(req.params.id)
      );

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
      }

      users.splice(userIndex, 1);
      return res.json({ message: 'User deleted successfully in memory demo mode.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
