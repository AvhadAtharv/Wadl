const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wad_assignment_4b';
  const timeout = Number(process.env.DB_CONNECT_TIMEOUT_MS || 5000);

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: timeout
  });
}

module.exports = connectDatabase;
