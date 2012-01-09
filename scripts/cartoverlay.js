(function() {

  jQuery().ready(function($) {
    return $('.cart').hover(function() {
      if (!$('#cartoverlay').is(":visible")) {
        return now.cart.get(function(cart) {
          var cartoverlaydiv, deletediv, descriptiondiv, item, odd, productdiv, _i, _len, _ref;
          cartoverlaydiv = document.createElement('div');
          cartoverlaydiv.id = 'cartoverlay';
          $(cartoverlaydiv).append('<div class="row"><h4>My Cart</h4><img class="closeimg" src="images/close_20.png"/></div>');
          if (cart.items < 1) {
            productdiv = document.createElement('div');
            $(productdiv).addClass('row');
            $(productdiv).append('<h5>You have no products in your cart</h5>');
            $(cartoverlaydiv).append(productdiv);
          } else {
            odd = true;
          }
          _ref = cart.items;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            productdiv = document.createElement('div');
            productdiv.id = item.item.itemcode;
            $(productdiv).addClass('product');
            if (odd) {
              $(productdiv).addClass('odd');
              odd = false;
            } else {
              odd = true;
            }
            $(productdiv).addClass('row');
            descriptiondiv = document.createElement('div');
            $(descriptiondiv).addClass('description');
            $(descriptiondiv).append('<img class="carticon rowimage" src="images/' + item.item.thumbnail + '"/>  ' + item.item.displayname + ' :  Qty. ' + item.quantity + ' @ ' + formatCurrency(item.item.price));
            deletediv = document.createElement('div');
            deletediv.id = 'delete_' + item.item.itemcode;
            $(deletediv).addClass('delete');
            $(deletediv).append('<img class="rowimage" src="images/delete_20.png"/>');
            $(productdiv).append(descriptiondiv);
            $(productdiv).append(deletediv);
            $(cartoverlaydiv).append(productdiv);
          }
          $(cartoverlaydiv).append('<div class="row"><hr/><div id="totalitems"><h6>Total Items: ' + cart.totalitems + '</h6></div><div id="totalprice"><h6>Total Price: ' + formatCurrency(cart.totalprice) + '</h6></div><hr/></div>');
          $(cartoverlaydiv).append('<div class="row" id="linkhint"><br/>To access this cart from another browser, use this URL:<br/> http://127.0.0.1/TCWHome.html?cartid=' + cart.cartid + '</div>');
          $('body').prepend(cartoverlaydiv);
          $(cartoverlaydiv).fadeIn(100);
          $('.closeimg').click(function() {
            return $('#cartoverlay').fadeOut(100).remove();
          });
          return $('.delete').click(function() {
            now.cart.remove(1, {
              displayname: 'Liono - Limited Edition',
              itemcode: 'liono',
              price: 75,
              thumbnail: 'liono_150.png',
              gallery: 'liono_500.png'
            });
            return $('#' + $(this).attr('id').substring(7)).fadeOut(100).remove();
          });
        });
      }
    });
  });

}).call(this);
