# Assignment 2b

Prepared for: `Atharv Avhad`

This folder contains a simple Docker container environment for a Node.js web page.

## Files

- `Dockerfile` to build the image
- `docker-compose.yml` to run the container
- `server.js` for the HTTP server
- `public/` for the website content

## Run with Docker

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

If the page does not load after a previous run, stop Docker with `Ctrl + C` and run the command again so Compose picks up the `HOST=0.0.0.0` setting.
