# Assignment 3b

Prepared for: `Atharv Avhad`

Express + MongoDB CRUD API for user administration.

## Implemented APIs

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

## Setup

1. Copy `.env.example` to `.env`
2. Make sure MongoDB is running locally for real database storage
3. Install dependencies
4. Start the server

```bash
npm install
npm start
```

The API starts on `http://localhost:3001`.

Open the browser page:

```text
http://127.0.0.1:3001/
```

If MongoDB is not running, the server still starts in memory demo mode so the endpoints can be tested. Start MongoDB for persistent storage.
