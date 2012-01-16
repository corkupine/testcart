(function() {
  var client, createCart, everyone, fs, getParameterByName, getProductsFromRedis, getcartid, getcookie, getguid, http, iscookieset, itemincart, itemindex, nowjs, path, productFilePath, redis, sendmessage, server, updateRedisProductsFromFile, url;

  http = require('http');

  fs = require('fs');

  path = require('path');

  redis = require('redis');

  url = require('url');

  client = redis.createClient();

  client.on("error", function(err) {
    return console.log("Error " + err);
  });

  client.on("ready", function() {
    return updateRedisProductsFromFile();
  });

  productFilePath = 'products.json';

  updateRedisProductsFromFile = function() {
    return fs.readFile(productFilePath, function(error, content) {
      var product, productkey, products, _i, _len, _results;
      if (error) {
        return console.log(error);
      } else {
        products = JSON.parse(content);
        _results = [];
        for (_i = 0, _len = products.length; _i < _len; _i++) {
          product = products[_i];
          productkey = 'products:' + product.itemcode;
          _results.push(client.hmset(productkey, product));
        }
        return _results;
      }
    });
  };

  getProductsFromRedis = function(callback) {
    var products;
    products = [];
    return client.keys('products*', function(err, keys) {
      var i, _ref, _results;
      _results = [];
      for (i = 0, _ref = keys.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push(client.hgetall(keys[i], function(err, obj) {
          products.push(obj);
          if (products.length === keys.length) return callback(products);
        }));
      }
      return _results;
    });
  };

  server = http.createServer(function(request, response) {
    var cartid, contentType, extension, filePath, uri;
    console.log('Request starting: ' + request.headers.cookie);
    uri = url.parse(request.url).pathname;
    filePath = path.join(process.cwd(), uri);
    if (uri === '/') filePath = path.join(process.cwd(), '/TCWHome.html');
    cartid = getcartid(request);
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
            response.writeHead(200, iscookieset(request.headers.cookie, cartid) || contentType !== 'text/html' ? {
              'Content-Type': contentType
            } : {
              'Content-Type': contentType,
              'Set-Cookie': 'cartid=' + cartid
            });
            return response.end(content, 'utf-8');
          }
        });
      } else {
        if (filePath.indexOf('./Products' === 0)) {
          response.writeHead(200, {
            'Content-Type': 'application/json'
          });
          return getProductsFromRedis(function(products) {
            return response.end(JSON.stringify(products));
          });
        } else {
          response.writeHead(404);
          return response.end();
        }
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

  everyone.now.claimcart = function(cartid) {
    nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId);
    nowjs.getGroup(cartid).addUser(this.user.clientId);
    this.now.cartsession = cartid;
    if (!(nowjs.getGroup(this.now.cartsession).now.cart != null)) {
      nowjs.getGroup(this.now.cartsession).now.cart = createCart(cartid);
    }
    return this.now.updatecart();
  };

  everyone.now.updatecarts = function() {
    if (this.now.cartsession !== "nosession") {
      return nowjs.getGroup(this.now.cartsession).now.updatecart();
    }
  };

  createCart = function(cartid) {
    var api, _cart;
    _cart = {
      items: [],
      totalprice: 0,
      totalitems: 0,
      cartid: cartid
    };
    api = {};
    api.add = function(quantity, item) {
      var existingitem;
      existingitem = itemincart(item.itemcode, _cart);
      if (!existingitem) {
        _cart.items.push({
          quantity: quantity,
          item: item
        });
      } else {
        existingitem.quantity += quantity;
      }
      _cart.totalitems += quantity;
      _cart.totalprice += quantity * item.price;
      return sendmessage(_cart.cartid, quantity + " of " + item.displayname + " added to your cart.", "info");
    };
    api.remove = function(quantity, item) {
      var existingitem, index;
      existingitem = itemincart(item.itemcode, _cart);
      if (!existingitem) {
        return sendmessage(_cart.cartid, "Attempted to remove " + quantity + " of " + item.displayname + " from your cart. There are no " + item.displayname + "s in your cart.", "warning");
      } else if (existingitem.quantity < quantity) {
        return sendmessage(_cart.cartid, "Attempted to remove " + quantity + " of " + item.displayname + " from your cart. You don't have that many of the " + item.displayname + " in your cart.", "warning");
      } else {
        if (existingitem.quantity === quantity) {
          index = itemindex(item.itemcode, _cart);
          if (index >= 0) {
            _cart.items.splice(index, 1);
            sendmessage(_cart.cartid, "We've removed all remaining " + item.displayname + "s from your cart.", "info");
          }
        } else {
          existingitem.quantity -= quantity;
          sendmessage(_cart.cartid, quantity + " of " + item.displayname + " removed from your cart.", "info");
        }
        _cart.totalitems -= quantity;
        return _cart.totalprice += -quantity * item.price;
      }
    };
    api.get = function(callback) {
      return callback(_cart);
    };
    return api;
  };

  itemincart = function(itemcode, cart) {
    var index;
    index = itemindex(itemcode, cart);
    if (index === -1) {
      return null;
    } else {
      return cart.items[index];
    }
  };

  itemindex = function(itemcode, cart) {
    var i, _ref;
    for (i = 0, _ref = cart.items.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      if (cart.items[i].item.itemcode === itemcode) return i;
    }
    return -1;
  };

  sendmessage = function(cartid, message, style) {
    return nowjs.getGroup(cartid).now.presentmessage(message, style);
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
