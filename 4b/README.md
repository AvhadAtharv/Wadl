# Assignment 4b

Prepared for: `Atharv Avhad`

This folder contains a deployment-ready Node.js web application for the AWS Elastic Beanstalk option of the assignment.

## What is included

- Express CRUD API for user administration
- Browser landing page at `/`
- Health check route at `/api/health`
- Elastic Beanstalk `Procfile`
- `.ebextensions` configuration for environment variables and health checks
- MongoDB support with automatic memory-mode fallback for demo deployments

## Project structure

```text
4b/
├── .ebextensions/
├── Procfile
├── package.json
├── README.md
└── src/
```

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start the application:

```bash
npm start
```

4. Open:

```text
http://127.0.0.1:3001/
```

If MongoDB is unavailable, the app still starts in memory demo mode.

## AWS Elastic Beanstalk deployment

This project is prepared for a Node.js web server environment on AWS Elastic Beanstalk.

### Recommended architecture

- Internet
- Elastic Load Balancer
- Elastic Beanstalk environment
- Node.js Express application
- MongoDB Atlas connection through `MONGODB_URI`

### Environment variables to set in Elastic Beanstalk

- `MONGODB_URI` = your MongoDB Atlas or remote MongoDB connection string
- `DB_CONNECT_TIMEOUT_MS` = `5000`

`HOST` and `NODE_ENV` are already configured through `.ebextensions`. Local runs can keep `HOST=127.0.0.1`, while Elastic Beanstalk overrides it to `0.0.0.0`.

### Deploy using the AWS console

1. Open AWS Elastic Beanstalk.
2. Create a new application.
3. Choose a current `Node.js` web server platform on Amazon Linux 2023.
4. Upload the contents of this `4b` folder as the source bundle.
5. In the environment configuration, add `MONGODB_URI` if you want persistent database storage.
6. Create the environment and wait until health becomes green.
7. Open the environment URL and verify:
   - `/`
   - `/api/health`
   - `/api/users`

### Create the source bundle

From inside the `4b` folder, create a zip file without `node_modules`:

```bash
zip -r deployment.zip . -x "node_modules/*" ".env" "*.git*"
```

Upload `deployment.zip` to Elastic Beanstalk.

### Deploy using the EB CLI

If the EB CLI is installed and AWS credentials are configured:

```bash
eb init
eb create assignment-4b-env
eb setenv MONGODB_URI="your-mongodb-connection-string"
eb deploy
```

## Health check

Elastic Beanstalk is configured to use:

```text
/api/health
```

This helps the environment report healthy status only when the application is responding.

## Submission note

For the assignment report, capture:

- Elastic Beanstalk application dashboard
- Running environment URL
- Browser output of `/`
- Browser or JSON output of `/api/health`
