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
        <title>Assignment 4b - AWS Elastic Beanstalk Deployment</title>
        <style>
          :root {
            color-scheme: light;
            font-family: Arial, sans-serif;
          }
          body {
            margin: 0;
            background: linear-gradient(180deg, #edf4ff 0%, #f8fbff 100%);
            color: #102538;
          }
          main {
            width: min(960px, calc(100% - 2rem));
            margin: 0 auto;
            padding: 2rem 0;
          }
          section {
            background: #ffffff;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(16, 37, 56, 0.08);
          }
          h1 {
            margin-top: 0;
            font-size: clamp(2rem, 4vw, 2.8rem);
          }
          p,
          li {
            line-height: 1.6;
          }
          code {
            background: #edf4ff;
            padding: 0.15rem 0.35rem;
            border-radius: 4px;
          }
          ul {
            padding-left: 1.2rem;
          }
          li + li {
            margin-top: 0.5rem;
          }
          .eyebrow {
            display: inline-block;
            margin-bottom: 0.6rem;
            padding: 0.4rem 0.7rem;
            border-radius: 999px;
            background: #102538;
            color: #ffffff;
            font-size: 0.9rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          .status {
            display: inline-block;
            margin: 0.75rem 0 1.25rem;
            padding: 0.65rem 0.9rem;
            border-radius: 10px;
            background: #e8f7ee;
            color: #0f7140;
            font-weight: 700;
          }
          a {
            color: #0b6db0;
          }
        </style>
      </head>
      <body>
        <main>
          <section>
            <span class="eyebrow">Assignment 4b</span>
            <h1>AWS Elastic Beanstalk Deployment</h1>
            <p>
              This Express CRUD API is prepared for <strong>Atharv Avhad</strong> and is ready to
              run locally or on AWS Elastic Beanstalk.
            </p>
            <p class="status">${databaseNote}</p>
            <h2>Application Links</h2>
            <ul>
              <li><a href="/api/health">/api/health</a></li>
              <li><a href="/api/users">/api/users</a></li>
            </ul>
            <h2>Supported API Routes</h2>
            <ul>
              <li><code>POST /api/users/register</code></li>
              <li><code>POST /api/users/login</code></li>
              <li><code>GET /api/users</code></li>
              <li><code>GET /api/users/:id</code></li>
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
    message: 'Assignment 4b API is running',
    owner: 'Atharv Avhad',
    deploymentTarget: 'AWS Elastic Beanstalk',
    databaseMode: req.app.locals.databaseMode,
    databaseError: req.app.locals.databaseError || null
  });
});

app.use('/api/users', userRoutes);

module.exports = app;
