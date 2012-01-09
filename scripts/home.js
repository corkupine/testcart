(function() {
  var addtocart, asst1, asst2, asst3, asst4, cartid, getcookie, liono, removefromcart, tygra;

  jQuery().ready(function($) {
    $('.TCWSpinner').spinner({
      min: 0,
      max: 99
    });
    $('#addLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      addtocart(quantity, liono);
      return false;
    });
    $('#removeLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      removefromcart(quantity, liono);
      return false;
    });
    $('#addTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      addtocart(quantity, tygra);
      return false;
    });
    $('#removeTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      removefromcart(quantity, tygra);
      return false;
    });
    $('#addAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      addtocart(quantity, asst4);
      return false;
    });
    $('#removeAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      removefromcart(quantity, asst4);
      return false;
    });
    $('#addAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      addtocart(quantity, asst1);
      return false;
    });
    $('#removeAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      removefromcart(quantity, asst1);
      return false;
    });
    $('#addAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      addtocart(quantity, asst2);
      return false;
    });
    $('#removeAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      removefromcart(quantity, asst2);
      return false;
    });
    $('#addAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      addtocart(quantity, asst3);
      return false;
    });
    return $('#removeAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      removefromcart(quantity, asst3);
      return false;
    });
  });

  liono = {
    displayname: 'Liono - Limited Edition',
    itemcode: 'liono',
    price: 75,
    thumbnail: 'liono_150.png',
    gallery: 'liono_500.png'
  };

  tygra = {
    displayname: 'Tygra - Limited Edition',
    itemcode: 'tygra',
    price: 75,
    thumbnail: 'tygra_150.png',
    gallery: 'tygra_500.png'
  };

  asst4 = {
    displayname: 'Liono & Tygra Bundle',
    itemcode: 'asst4',
    price: 145,
    thumbnail: 'asst4_150.png',
    gallery: 'asst4_500.png'
  };

  asst1 = {
    displayname: 'Collectors Set 1',
    itemcode: 'asst1',
    price: 75,
    thumbnail: 'asst1_150.png',
    gallery: 'asst1_500.png'
  };

  asst2 = {
    displayname: 'Collectors Set 2',
    itemcode: 'asst2',
    price: 75,
    thumbnail: 'asst2_150.png',
    gallery: 'asst2_500.png'
  };

  asst3 = {
    displayname: 'Collectors Set 3',
    itemcode: 'asst3',
    price: 75,
    thumbnail: 'asst3_150.png',
    gallery: 'asst3_500.png'
  };

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
      return $('#itemQuantity').html(cart.totalitems + " Items");
    });
  };

  now.presentmessage = function(message, style) {
    if (style === "info") {
      return $.jnotify(message);
    } else {
      return $.jnotify(message, style);
    }
  };

  now.ready(function() {
    return now.claimcart(cartid);
  });

}).call(this);
