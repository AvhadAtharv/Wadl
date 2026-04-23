const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wad_assignment_3b';

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 1500
  });
}

module.exports = connectDatabase;
