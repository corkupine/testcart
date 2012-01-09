# TODO: Use backbone.js to manage model state, sync cart area in banner, etc.
# TODO: Put strings in a resource file

jQuery().ready ($) ->
  $('.TCWSpinner').spinner
    min: 0
    max: 99
  $('#addLiono').click () ->
    quantity=parseInt $('#spinner1').val()
    addtocart quantity,liono
    return false
  $('#removeLiono').click () ->
    quantity=parseInt $('#spinner1').val()
    removefromcart quantity,liono
    return false
  $('#addTygra').click () ->
    quantity=parseInt $('#spinner2').val()
    addtocart quantity,tygra
    return false
  $('#removeTygra').click () ->
    quantity=parseInt $('#spinner2').val()
    removefromcart quantity,tygra
    return false
  $('#addAsst4').click () ->
    quantity=parseInt $('#spinner3').val()
    addtocart quantity,asst4
    return false
  $('#removeAsst4').click () ->
    quantity=parseInt $('#spinner3').val()
    removefromcart quantity,asst4
    return false
  $('#addAsst1').click () ->
    quantity=parseInt $('#spinner4').val()
    addtocart quantity,asst1
    return false
  $('#removeAsst1').click () ->
    quantity=parseInt $('#spinner4').val()
    removefromcart quantity,asst1
    return false
  $('#addAsst2').click () ->
    quantity=parseInt $('#spinner5').val()
    addtocart quantity,asst2
    return false
  $('#removeAsst2').click () ->
    quantity=parseInt $('#spinner5').val()
    removefromcart quantity,asst2
    return false
  $('#addAsst3').click () ->
    quantity=parseInt $('#spinner6').val()
    addtocart quantity,asst3
    return false
  $('#removeAsst3').click () ->
    quantity=parseInt $('#spinner6').val()
    removefromcart quantity,asst3
    return false

# In a real app, maybe we'd do something like this?
# $.get 'services/productdata', (data) ->
#   productdata = data

liono =
  displayname:'Liono - Limited Edition'
  itemcode:'liono'
  price:75
  thumbnail:'liono_150.png'
  gallery:'liono_500.png'
tygra =
  displayname:'Tygra - Limited Edition'
  itemcode:'tygra'
  price:75
  thumbnail:'tygra_150.png'
  gallery:'tygra_500.png'
asst4 =
  displayname:'Liono & Tygra Bundle'
  itemcode:'asst4'
  price:145
  thumbnail:'asst4_150.png'
  gallery:'asst4_500.png'
asst1 =
  displayname:'Collectors Set 1'
  itemcode:'asst1'
  price:75
  thumbnail:'asst1_150.png'
  gallery:'asst1_500.png'
asst2 =
  displayname:'Collectors Set 2'
  itemcode:'asst2'
  price:75
  thumbnail:'asst2_150.png'
  gallery:'asst2_500.png'
asst3 =
  displayname:'Collectors Set 3'
  itemcode:'asst3'
  price:75
  thumbnail:'asst3_150.png'
  gallery:'asst3_500.png'

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

now.presentmessage = (message, style) ->
  if style is "info"
    $.jnotify message
  else
    $.jnotify message,style

now.ready () ->
  now.claimcart cartid

