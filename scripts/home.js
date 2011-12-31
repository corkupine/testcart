(function() {
  var adjusttotals, asst1, asst2, asst3, asst4, cart, formatCurrency, itemincart, itemindex, liono, sendmessage, tygra, updatebanner;

  jQuery().ready(function($) {
    $('#spinner1').spinner({
      min: 0,
      max: 99
    });
    $('#spinner2').spinner({
      min: 0,
      max: 99
    });
    $('#spinner3').spinner({
      min: 0,
      max: 99
    });
    $('#spinner4').spinner({
      min: 0,
      max: 99
    });
    $('#spinner5').spinner({
      min: 0,
      max: 99
    });
    $('#spinner6').spinner({
      min: 0,
      max: 99
    });
    $('#addLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      now.addtocarts(quantity, liono);
      return false;
    });
    $('#removeLiono').click(function() {
      var quantity;
      quantity = parseInt($('#spinner1').val());
      now.removefromcarts(quantity, liono);
      return false;
    });
    $('#addTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      now.addtocarts(quantity, tygra);
      return false;
    });
    $('#removeTygra').click(function() {
      var quantity;
      quantity = parseInt($('#spinner2').val());
      now.removefromcarts(quantity, tygra);
      return false;
    });
    $('#addAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      now.addtocarts(quantity, asst4);
      return false;
    });
    $('#removeAsst4').click(function() {
      var quantity;
      quantity = parseInt($('#spinner3').val());
      now.removefromcarts(quantity, asst4);
      return false;
    });
    $('#addAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      now.addtocarts(quantity, asst1);
      return false;
    });
    $('#removeAsst1').click(function() {
      var quantity;
      quantity = parseInt($('#spinner4').val());
      now.removefromcarts(quantity, asst1);
      return false;
    });
    $('#addAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      now.addtocarts(quantity, asst2);
      return false;
    });
    $('#removeAsst2').click(function() {
      var quantity;
      quantity = parseInt($('#spinner5').val());
      now.removefromcarts(quantity, asst2);
      return false;
    });
    $('#addAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      now.addtocarts(quantity, asst3);
      return false;
    });
    return $('#removeAsst3').click(function() {
      var quantity;
      quantity = parseInt($('#spinner6').val());
      now.removefromcarts(quantity, asst3);
      return false;
    });
  });

  liono = {
    displayname: 'Liono - Limited Edition',
    itemcode: 'liono',
    price: 75
  };

  tygra = {
    displayname: 'Tygra - Limited Edition',
    itemcode: 'tygra',
    price: 75
  };

  asst4 = {
    displayname: 'Liono & Tygra Bundle',
    itemcode: 'asst4',
    price: 145
  };

  asst1 = {
    displayname: 'Collectors Set 1',
    itemcode: 'asst1',
    price: 75
  };

  asst2 = {
    displayname: 'Collectors Set 2',
    itemcode: 'asst2',
    price: 75
  };

  asst3 = {
    displayname: 'Collectors Set 3',
    itemcode: 'asst3',
    price: 75
  };

  cart = {
    items: [],
    totalitems: 0,
    totalprice: 0
  };

  /*
  cartid = getCookie 'fakeCartSession'
  now.claimCart cartid
  
  getCookie = (name) ->
    nameEQ = name + "="
    ca = document.cookie.split ';'
    for i in [0...ca.length]
      c = ca[i]
      while c.charAt 0 is ' '
        c = c.substring(1,c.length)
      if c.indexOf nameEQ is 0 then return c.substring nameEQ.length,c.length
    return null
  */

  now.addtocart = function(quantity, item) {
    var existingitem;
    if (quantity > 0) {
      if (cart != null) {
        existingitem = itemincart(item.itemcode);
        if (!existingitem) {
          cart.items.push({
            quantity: quantity,
            item: item
          });
        } else {
          existingitem.quantity += quantity;
        }
        adjusttotals(quantity, item.price);
        updatebanner();
        return sendmessage(quantity + " of " + item.displayname + " added to your cart.", "info");
      } else {
        cart = {
          items: [],
          totalitems: 0,
          totalprice: 0
        };
        return sendmessage("Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.", "error");
      }
    }
  };

  now.removefromcart = function(quantity, item) {
    var existingitem, index;
    if (quantity > 0) {
      if (cart != null) {
        existingitem = itemincart(item.itemcode);
        if (!existingitem) {
          return sendmessage("There are no " + item.displayname + "s in your cart.", "warning");
        } else if (existingitem.quantity < quantity) {
          return sendmessage("You don't have that many of the " + item.displayname + " in your cart.", "warning");
        } else {
          if (existingitem.quantity === quantity) {
            index = itemindex(item.itemcode);
            if (index >= 0) {
              cart.items.splice(index, 1);
              sendmessage("We've removed all remaining " + item.displayname + "s from your cart.", "info");
            }
          } else {
            existingitem.quantity -= quantity;
            sendmessage(quantity + " of " + item.displayname + " removed from your cart.", "info");
          }
          adjusttotals(-quantity, item.price);
          return updatebanner();
        }
      } else {
        cart = {
          items: [],
          totalitems: 0,
          totalprice: 0
        };
        return sendmessage('Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.', "error");
      }
    }
  };

  adjusttotals = function(quantity, price) {
    cart.totalitems += quantity;
    return cart.totalprice += quantity * price;
  };

  updatebanner = function() {
    $('#cartTotal').html(formatCurrency(cart.totalprice));
    return $('#itemQuantity').html(cart.totalitems + " Items");
  };

  formatCurrency = function(number) {
    return "$" + parseFloat(number.toFixed(2));
  };

  itemincart = function(itemcode) {
    var index;
    index = itemindex(itemcode);
    if (index === -1) {
      return null;
    } else {
      return cart.items[index];
    }
  };

  itemindex = function(itemcode) {
    var i, _ref;
    for (i = 0, _ref = cart.items.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      if (cart.items[i].item.itemcode === itemcode) return i;
    }
    return -1;
  };

  sendmessage = function(message, style) {
    if (style === "info") {
      return $.jnotify(message);
    } else {
      return $.jnotify(message, style);
    }
  };

}).call(this);
