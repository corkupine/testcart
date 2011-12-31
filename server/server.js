(function() {
  var everyone, fs, http, nowjs, path, server;

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
              'Content-Type': contentType,
              'Set-Cookie': 'fakeCartSession=XYZ123'
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

  nowjs = require('now');

  everyone = nowjs.initialize(server);

  nowjs.on('connect', function() {
    this.now.cartsession = "nosession";
    return nowjs.getGroup(this.now.cartsession).addUser(this.user.clientId);
  });

  everyone.now.claimCart = function(newCart) {
    nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId);
    nowjs.getGroup(newCart).addUser(this.user.clientId);
    return this.now.cartsession = newCart;
  };

  everyone.now.addtocarts = function(quantity, item) {
    return nowjs.getGroup(this.now.cartsession).now.addtocart(quantity, item);
  };

  everyone.now.removefromcarts = function(quantity, item) {
    return nowjs.getGroup(this.now.cartsession).now.removefromcart(quantity, item);
  };

}).call(this);
