(function() {

  jQuery().ready(function($) {
    return $('.cart').hover(function() {
      if (!$('#cartoverlay').is(":visible")) {
        return now.cart.get(function(cart) {
          var cartoverlaydiv, productsdiv, productsholderdiv;
          cartoverlaydiv = document.createElement('div');
          cartoverlaydiv.id = 'cartoverlay';
          $(cartoverlaydiv).append('<div class="row"><h4>My Cart</h4><img class="closeimg" src="images/close_20.png"/></div>');
          productsholderdiv = document.createElement('div');
          productsholderdiv.id = 'productsholder';
          productsdiv = getProductsDiv(cart);
          $(productsholderdiv).append(productsdiv);
          $(cartoverlaydiv).append(productsholderdiv);
          $(cartoverlaydiv).append('<div class="row"><hr/><div id="totalitems"><h6>Total Items: ' + cart.totalitems + '</h6></div><div id="totalprice"><h6>Total Price: ' + formatCurrency(cart.totalprice) + '</h6></div><hr/></div>');
          $(cartoverlaydiv).append('<div class="row" id="linkhint"><br/>To access this cart from another browser, use this URL:<br/> http://127.0.0.1/TCWHome.html?cartid=' + cart.cartid + '</div>');
          $('body').prepend(cartoverlaydiv);
          $(cartoverlaydiv).fadeIn(100);
          return $('#cartoverlay').click(function(event) {
            var itemcode, targetElement;
            targetElement = event.target;
            if ($(targetElement).is('.delete')) {
              itemcode = $(targetElement).attr('id').substring(7);
              return now.cart.get(function(cart) {
                var item, _i, _len, _ref;
                _ref = cart.items;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  item = _ref[_i];
                  if (item.item.itemcode === itemcode) {
                    now.cart.remove(item.quantity, item.item);
                    now.updatecarts();
                  }
                }
                return $('#' + itemcode).fadeOut(100).remove();
              });
            } else if ($(targetElement).is('.closeimg')) {
              return $('#cartoverlay').fadeOut(100).remove();
            }
          });
        });
      }
    });
  });

  this.getProductsDiv = function(cart) {
    var deletediv, descriptiondiv, item, productdiv, productsdiv, _i, _len, _ref;
    productsdiv = document.createElement('div');
    productsdiv.id = 'products';
    if (cart.items < 1) {
      productdiv = document.createElement('div');
      $(productdiv).addClass('row');
      $(productdiv).append('<h5>You have no products in your cart</h5>');
      $(productsdiv).append(productdiv);
    } else {

    }
    _ref = cart.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      productdiv = document.createElement('div');
      productdiv.id = item.item.itemcode;
      $(productdiv).addClass('product');
      $(productdiv).addClass('row');
      descriptiondiv = document.createElement('div');
      $(descriptiondiv).addClass('description');
      $(descriptiondiv).append('<img class="carticon rowimage" src="images/' + item.item.thumbnail + '"/>  ' + item.item.displayname + ' :  Qty. ' + item.quantity + ' @ ' + formatCurrency(item.item.price));
      deletediv = document.createElement('div');
      $(deletediv).append('<img class="rowimage delete" id="delete_' + item.item.itemcode + '" src="images/delete_20.png"/>');
      $(productdiv).append(descriptiondiv);
      $(productdiv).append(deletediv);
      $(productsdiv).append(productdiv);
    }
    return productsdiv;
  };

}).call(this);
