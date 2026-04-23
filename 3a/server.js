const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 1800;
const publicDir = path.join(__dirname, 'public');

const mimeType = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

const renderFileLinks = () => {
  const files = fs
    .readdirSync(publicDir)
    .filter((entry) => fs.statSync(path.join(publicDir, entry)).isFile());

  const links = files
    .map(
      (file) =>
        `<li><a href="/${encodeURIComponent(file)}">${file}</a></li>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Assignment 3a - File Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; background: #f2f7fb; color: #102538; }
          main { width: min(900px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0; }
          section { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 14px 30px rgba(16, 37, 56, 0.08); }
          h1 { margin-top: 0; }
          ul { padding-left: 1.2rem; }
          li + li { margin-top: 0.5rem; }
          a { color: #0b7db5; text-decoration: none; }
        </style>
      </head>
      <body>
        <main>
          <section>
            <p><strong>Assignment 3a</strong></p>
            <h1>Static File Web Server</h1>
            <p>Prepared for Atharv Avhad. Click any file below to view its content.</p>
            <ul>${links}</ul>
          </section>
        </main>
      </body>
    </html>
  `;
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderFileLinks());
    return;
  }

  const safePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[/\\])+/, '');
  const pathname = path.join(publicDir, safePath);

  if (!pathname.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end('Access denied.');
    return;
  }

  if (!fs.existsSync(pathname) || fs.statSync(pathname).isDirectory()) {
    res.statusCode = 404;
    res.end(`File ${safePath} not found.`);
    return;
  }

  fs.readFile(pathname, (error, data) => {
    if (error) {
      res.statusCode = 500;
      res.end('Error in getting the file.');
      return;
    }

    const ext = path.extname(pathname);
    res.setHeader('Content-Type', mimeType[ext] || 'text/plain');
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Assignment 3a server listening on http://${HOST}:${PORT}`);
});
