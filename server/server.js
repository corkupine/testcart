(function() {
  var everyone, fs, getParameterByName, getcartid, getcookie, getguid, http, iscookieset, nowjs, path, server;

  http = require('http');

  fs = require('fs');

  path = require('path');

  server = http.createServer(function(request, response) {
    var cartid, contentType, extension, filePath;
    console.log('[server.coffee] request starting...');
    console.log(request.headers.cookie);
    filePath = '.' + request.url.split("?")[0];
    console.log(filePath);
    cartid = getcartid(request);
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
        console.log('Path exists');
        return fs.readFile(filePath, function(error, content) {
          if (error) {
            response.writeHead(500);
            return response.end();
          } else {
            response.writeHead(200, iscookieset(request.headers.cookie, cartid) ? {
              'Content-Type': contentType
            } : {
              'Content-Type': contentType,
              'Set-Cookie': 'cartid=' + cartid
            });
            return response.end(content, 'utf-8');
          }
        });
      } else {
        console.log('Path does not exist');
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

  everyone.now.claimcart = function(newCart) {
    nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId);
    nowjs.getGroup(newCart).addUser(this.user.clientId);
    return this.now.cartsession = newCart;
  };

  everyone.now.addtocarts = function(quantity, item) {
    if (this.now.cartsession !== "nosession") {
      return nowjs.getGroup(this.now.cartsession).now.addtocart(quantity, item);
    }
  };

  everyone.now.removefromcarts = function(quantity, item) {
    if (this.now.cartsession !== "nosession") {
      return nowjs.getGroup(this.now.cartsession).now.removefromcart(quantity, item);
    }
  };

  iscookieset = function(cookies, cartid) {
    var cookiecartid;
    if (cookies != null) cookiecartid = getcookie('cartid', cookies);
    if (cookiecartid === cartid) {
      return true;
    } else {
      return false;
    }
  };

  getcookie = function(name, cookies) {
    var cookie, cookie_array, namestr, _i, _len;
    namestr = name + "=";
    if (cookies != null) {
      cookie_array = cookies.split(';');
      for (_i = 0, _len = cookie_array.length; _i < _len; _i++) {
        cookie = cookie_array[_i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(namestr) === 0) {
          return cookie.substring(namestr.length, cookie.length);
        }
      }
    }
    return null;
  };

  getParameterByName = function(name, urlparams) {
    var keyvalpair, param, params, _i, _len;
    params = urlparams.split('&');
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      keyvalpair = param.split("=");
      if (keyvalpair[0] === name) return keyvalpair[1];
    }
    return null;
  };

  getcartid = function(request) {
    var cartid, urlParams;
    urlParams = request.url.split('?')[1];
    if (urlParams != null) cartid = getParameterByName('cartid', urlParams);
    if ((cartid != null) && cartid.length > 0) return cartid;
    cartid = getcookie('cartid', request.headers.cookie);
    if ((cartid != null) && cartid.length > 0) return cartid;
    return getguid();
  };

  getguid = function() {
    var S4;
    S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  };

}).call(this);
