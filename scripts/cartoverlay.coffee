jQuery().ready ($) ->
  $('.cart').hover(
    -> if not $('#cartoverlay').is(":visible")
      now.cart.get (cart) ->
        cartoverlaydiv = document.createElement 'div'
        cartoverlaydiv.id = 'cartoverlay'
        $(cartoverlaydiv).append('<div class="row"><h4>My Cart</h4><img class="closeimg" src="images/close_20.png"/></div>')
        productsholderdiv = document.createElement 'div'
        productsholderdiv.id = 'productsholder'
        productsdiv = getProductsDiv cart
        $(productsholderdiv).append(productsdiv)
        $(cartoverlaydiv).append(productsholderdiv)
        $(cartoverlaydiv).append('<div class="row"><hr/><div id="totalitems"><h6>Total Items: ' + cart.totalitems + '</h6></div><div id="totalprice"><h6>Total Price: ' + formatCurrency(cart.totalprice) + '</h6></div><hr/></div>')
        $(cartoverlaydiv).append('<div class="row" id="linkhint"><br/>To access this cart from another browser, use this URL:<br/><a href="http://127.0.0.1/TCWHome.html?cartid=' + cart.cartid + '"</a> http://127.0.0.1/TCWHome.html?cartid=' + cart.cartid + '</div>' )
        $('body').prepend(cartoverlaydiv)
        $(cartoverlaydiv).fadeIn(100)
        $('#cartoverlay').click (event) ->
          targetElement = event.target
          if $(targetElement).is '.delete'
            itemcode = $(targetElement).attr('id').substring(7)
            now.cart.get (cart) ->
              for item in cart.items
                if item.item.itemcode is itemcode
                  now.cart.remove item.quantity,item.item
                  now.updatecarts()
              $('#' + itemcode).fadeOut(100).remove()
          else if $(targetElement).is '.closeimg'
            $('#cartoverlay').fadeOut(100).remove()
  )

@getProductsDiv = (cart) ->
  productsdiv = document.createElement 'div'
  productsdiv.id = 'products'
  if cart.items < 1
    productdiv = document.createElement 'div'
    $(productdiv).addClass 'row'
    $(productdiv).append '<h5>You have no products in your cart</h5>'
    $(productsdiv).append(productdiv)
  else
  for item in cart.items
    productdiv = document.createElement 'div'
    productdiv.id = item.item.itemcode
    $(productdiv).addClass 'product'
    $(productdiv).addClass 'row'
    descriptiondiv = document.createElement 'div'
    $(descriptiondiv).addClass 'description'
    $(descriptiondiv).append('<img class="carticon rowimage" src="images/' + item.item.thumbnail + '"/>  ' + item.item.displayname + ' :  Qty. ' + item.quantity + ' @ ' + formatCurrency(item.item.price))
    deletediv = document.createElement 'div'
    $(deletediv).append '<img class="rowimage delete" id="delete_' + item.item.itemcode + '" src="images/delete_20.png"/>'
    $(productdiv).append descriptiondiv
    $(productdiv).append deletediv
    $(productsdiv).append(productdiv)
  return productsdiv