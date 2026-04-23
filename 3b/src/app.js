const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.locals.databaseMode = 'starting';
app.locals.databaseError = '';
app.locals.memoryUsers = [];

app.get('/', (req, res) => {
  const databaseNote =
    req.app.locals.databaseMode === 'mongodb'
      ? 'MongoDB connected'
      : `Memory demo mode${req.app.locals.databaseError ? `: ${req.app.locals.databaseError}` : ''}`;

  res.type('html').send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Assignment 3b - Atharv Avhad</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; background: #eef5fb; color: #102538; }
          main { width: min(940px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0; }
          section { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 14px 30px rgba(16, 37, 56, 0.08); }
          h1 { margin-top: 0; }
          code { background: #eef5fb; padding: 0.15rem 0.35rem; border-radius: 4px; }
          li + li { margin-top: 0.5rem; }
          .status { display: inline-block; margin: 0.5rem 0 1rem; padding: 0.55rem 0.8rem; border-radius: 8px; background: #e8f7ee; color: #0f7140; font-weight: 700; }
          a { color: #0b7db5; }
        </style>
      </head>
      <body>
        <main>
          <section>
            <p><strong>Assignment 3b</strong></p>
            <h1>CRUD API for User Administration</h1>
            <p>Prepared for Atharv Avhad.</p>
            <p class="status">${databaseNote}</p>
            <h2>Open these in browser</h2>
            <ul>
              <li><a href="/api/health">/api/health</a></li>
              <li><a href="/api/users">/api/users</a></li>
            </ul>
            <h2>Use Postman or curl for create/login</h2>
            <ul>
              <li><code>POST /api/users/register</code></li>
              <li><code>POST /api/users/login</code></li>
              <li><code>PATCH /api/users/:id</code></li>
              <li><code>DELETE /api/users/:id</code></li>
            </ul>
          </section>
        </main>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Assignment 3b API is running',
    owner: 'Atharv Avhad',
    databaseMode: req.app.locals.databaseMode,
    databaseError: req.app.locals.databaseError || null
  });
});

app.use('/api/users', userRoutes);

module.exports = app;
