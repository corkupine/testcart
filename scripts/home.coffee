# TODO: Use backbone.js, (or weld, jade, mustache, dust) to manage model state/templating, sync cart area in banner, etc.
#       Backbone/nowjs connector: https://github.com/mkuklis/backbone-nowjs
# TODO: Put strings in a resource file
# TODO: Make use of sugar, underscore, prototype (on client for DOM stuff) etc. instead of reinventing wheel,
#       and to make it more readable
# TODO: DRY up instances of products and associated events

# TODO: This is a start, but I need to use the returned array to set up each product area with description, pics, click event, etc.
products = []
productsurl = 'http://' + $(location).attr('host') + '/products'
$.get productsurl, (productdata) ->
  products = productdata

jQuery().ready ($) ->
  $('.TCWSpinner').spinner
    min: 0
    max: 99
  $('#addLiono').click () ->
    quantity=parseInt $('#spinner1').val()
    addtocart quantity,products[0]
    return false
  $('#removeLiono').click () ->
    quantity=parseInt $('#spinner1').val()
    removefromcart quantity,products[0]
    return false
  $('#addTygra').click () ->
    quantity=parseInt $('#spinner2').val()
    addtocart quantity,products[1]
    return false
  $('#removeTygra').click () ->
    quantity=parseInt $('#spinner2').val()
    removefromcart quantity,products[1]
    return false
  $('#addAsst4').click () ->
    quantity=parseInt $('#spinner3').val()
    addtocart quantity,products[2]
    return false
  $('#removeAsst4').click () ->
    quantity=parseInt $('#spinner3').val()
    removefromcart quantity,products[2]
    return false
  $('#addAsst1').click () ->
    quantity=parseInt $('#spinner4').val()
    addtocart quantity,products[3]
    return false
  $('#removeAsst1').click () ->
    quantity=parseInt $('#spinner4').val()
    removefromcart quantity,products[3]
    return false
  $('#addAsst2').click () ->
    quantity=parseInt $('#spinner5').val()
    addtocart quantity,products[4]
    return false
  $('#removeAsst2').click () ->
    quantity=parseInt $('#spinner5').val()
    removefromcart quantity,products[4]
    return false
  $('#addAsst3').click () ->
    quantity=parseInt $('#spinner6').val()
    addtocart quantity,products[5]
    return false
  $('#removeAsst3').click () ->
    quantity=parseInt $('#spinner6').val()
    removefromcart quantity,products[5]
    return false

addtocart = (quantity, item) ->
  if quantity > 0
    now.cart.add quantity,item
    now.updatecarts()

removefromcart = (quantity,item) ->
  if quantity > 0
    now.cart.remove quantity,item
    now.updatecarts()

@formatCurrency = (number) ->
  return "$" + parseFloat number.toFixed 2

getcookie = (name) ->
  namestr = name + "="
  cookie_array = document.cookie.split(';')
  for cookie in cookie_array
    cookie = cookie.substring(1, cookie.length) while (cookie.charAt(0) == ' ')
    return cookie.substring(namestr.length, cookie.length) if cookie.indexOf(namestr) == 0
  return null

cartid = getcookie 'cartid'

now.updatecart = () ->
  now.cart.get (cart) ->
    $('#cartTotal').html formatCurrency(cart.totalprice)
    $('#itemQuantity').html cart.totalitems + " Items"
    if $('#cartoverlay').is(":visible")
      $('#totalitems').html '<h6>Total Items: ' + cart.totalitems + '</h6>'
      $('#totalprice').html '<h6>Total Price: ' + formatCurrency(cart.totalprice) + '</h6>'
      $('#products').remove()
      $('#productsholder').append getProductsDiv(cart)

now.presentmessage = (message, style) ->
  if style is "info"
    $.jnotify message,1000
  else
    $.jnotify message,style,1000

now.ready () ->
  now.claimcart cartid

