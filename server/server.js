(function() {
  var fs, http, path, server;

  http = require('http');

  fs = require('fs');

  path = require('path');

  server = http.createServer(function(request, response) {
    var contentType, extension, filePath;
    console.log('[server.coffee] request starting...');
    filePath = '.' + request.url;
    if (filePath === './') filePath = './TCWHome.html';
    extension = path.extname(filePath);
    contentType = 'text/html';
    switch (extension) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
    }
    return path.exists(filePath, function(exists) {
      if (exists) {
        return fs.readFile(filePath, function(error, content) {
          if (error) {
            response.writeHead(500);
            return response.end();
          } else {
            response.writeHead(200, {
              'Content-Type': contentType
            });
            return response.end(content, 'utf-8');
          }
        });
      } else {
        response.writeHead(404);
        return response.end();
      }
    });
  });

  server.listen(80);

}).call(this);
