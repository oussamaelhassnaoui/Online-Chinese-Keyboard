const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Port to listen on
const PORT = 8080;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

// Route mapping for clean URLs
const ROUTES = {
  '/chinese-keyboard': '/index.html',
  '/pinyin-keyboard': '/pinyin-keyboard.html',
  '/convert-pinyin-to-chinese': '/convert-pinyin-to-chinese.html',
  '/chinese-stroke-keyboard': '/chinese-stroke-keyboard.html',
  '/chinese-keyboard-mobile': '/chinese-keyboard-mobile.html',
  '/simplified-vs-traditional-chinese': '/simplified-vs-traditional-chinese.html',
  '/how-to-type-in-chinese': '/how-to-type-in-chinese.html',
  '/faq': '/faq.html'
};

// Create the server
const server = http.createServer((req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root path
  if (pathname === '/') {
    pathname = '/chinese-keyboard';
  }
  
  // Map clean URLs to actual files
  let filePath = ROUTES[pathname] || pathname;
  
  // If no route matched and no file extension, default to .html
  if (!path.extname(filePath)) {
    filePath += '.html';
  }
  
  // Resolve the file path
  filePath = path.join(__dirname, filePath);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, serve 404 page
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1><p>The requested page could not be found.</p>');
      return;
    }
    
    // Determine content type
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>There was an error serving the requested file.</p>');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Available routes:');
  console.log('- http://localhost:8080/chinese-keyboard');
  console.log('- http://localhost:8080/pinyin-keyboard');
  console.log('- http://localhost:8080/convert-pinyin-to-chinese');
  console.log('- http://localhost:8080/chinese-stroke-keyboard');
  console.log('- http://localhost:8080/chinese-keyboard-mobile');
  console.log('- http://localhost:8080/simplified-vs-traditional-chinese');
  console.log('- http://localhost:8080/how-to-type-in-chinese');
  console.log('- http://localhost:8080/faq');
});