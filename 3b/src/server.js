require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3001;

function startServer() {
  app.listen(port, host, () => {
    console.log(`Assignment 3b API listening on http://${host}:${port}`);
  });
}

connectDatabase()
  .then(() => {
    app.locals.databaseMode = 'mongodb';
    app.locals.databaseError = '';
    console.log('MongoDB connected successfully.');
    startServer();
  })
  .catch((error) => {
    app.locals.databaseMode = 'memory';
    app.locals.databaseError = error.message;
    console.warn(`MongoDB not available. Using memory demo mode: ${error.message}`);
    startServer();
  });
