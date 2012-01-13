(function() {
  var addtocart, cartid, getcookie, products, productsurl, removefromcart;

  jQuery().ready(function($) {
    $('.TCWSpinner').spinner({
      min: 0,
      max: 99
    });
    $('#addLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      addtocart(quantity, products[0]);
      return false;
    });
    $('#removeLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      removefromcart(quantity, products[0]);
      return false;
    });
    $('#addTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      addtocart(quantity, products[1]);
      return false;
    });
    $('#removeTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      removefromcart(quantity, products[1]);
      return false;
    });
    $('#addAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      addtocart(quantity, products[2]);
      return false;
    });
    $('#removeAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      removefromcart(quantity, products[2]);
      return false;
    });
    $('#addAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      addtocart(quantity, products[3]);
      return false;
    });
    $('#removeAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      removefromcart(quantity, products[3]);
      return false;
    });
    $('#addAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      addtocart(quantity, products[4]);
      return false;
    });
    $('#removeAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      removefromcart(quantity, products[4]);
      return false;
    });
    $('#addAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      addtocart(quantity, products[5]);
      return false;
    });
    return $('#removeAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      removefromcart(quantity, products[5]);
      return false;
    });
  });

  products = [];

  productsurl = 'http://' + $(location).attr('host') + '/products';

  $.get(productsurl, function(productdata) {
    return products = productdata;
  });

  addtocart = function(quantity, item) {
    if (quantity > 0) {
      now.cart.add(quantity, item);
      return now.updatecarts();
    }
  };

  removefromcart = function(quantity, item) {
    if (quantity > 0) {
      now.cart.remove(quantity, item);
      return now.updatecarts();
    }
  };

  this.formatCurrency = function(number) {
    return "$" + parseFloat(number.toFixed(2));
  };

  getcookie = function(name) {
    var cookie, cookie_array, namestr, _i, _len;
    namestr = name + "=";
    cookie_array = document.cookie.split(';');
    for (_i = 0, _len = cookie_array.length; _i < _len; _i++) {
      cookie = cookie_array[_i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(namestr) === 0) {
        return cookie.substring(namestr.length, cookie.length);
      }
    }
    return null;
  };

  cartid = getcookie('cartid');

  now.updatecart = function() {
    return now.cart.get(function(cart) {
      $('#cartTotal').html(formatCurrency(cart.totalprice));
      $('#itemQuantity').html(cart.totalitems + " Items");
      if ($('#cartoverlay').is(":visible")) {
        $('#totalitems').html('<h6>Total Items: ' + cart.totalitems + '</h6>');
        $('#totalprice').html('<h6>Total Price: ' + formatCurrency(cart.totalprice) + '</h6>');
        $('#products').remove();
        return $('#productsholder').append(getProductsDiv(cart));
      }
    });
  };

  now.presentmessage = function(message, style) {
    if (style === "info") {
      return $.jnotify(message, 1000);
    } else {
      return $.jnotify(message, style, 1000);
    }
  };

  now.ready(function() {
    return now.claimcart(cartid);
  });

}).call(this);
