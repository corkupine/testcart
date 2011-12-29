# TODO: Somehow iterate through setting up spinners (by class?)
# TODO: Wire this shit up to nowjs to communicate between sessions
# TODO: Update cart section of banner, build lil' mouseover thingie
# TODO: Implement jGrowl in sendmessage
# TODO: Use backbone.js to manage model state, sync cart area in banner, etc.

jQuery().ready ($) ->
  $('#spinner1').spinner
    min: 0
    max: 99
  $('#spinner2').spinner
    min: 0
    max: 99
  $('#spinner3').spinner
    min: 0
    max: 99
  $('#spinner4').spinner
    min: 0
    max: 99
  $('#spinner5').spinner
    min: 0
    max: 99
  $('#spinner6').spinner
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

liono =
  displayname:'Liono - Limited Edition'
  itemcode:'liono'
  price:75
tygra =
  displayname:'Tygra - Limited Edition'
  itemcode:'tygra'
  price:75
asst4 =
  displayname:'Liono & Tygra Bundle'
  itemcode:'asst4'
  price:145
asst1 =
  displayname:'Collectors Set 1'
  itemcode:'asst1'
  price:75
asst2 =
  displayname:'Collectors Set 2'
  itemcode:'asst2'
  price:75
asst3 =
  displayname:'Collectors Set 3'
  itemcode:'asst3'
  price:75

cart =
  items:[]
  totalitems:0
  totalprice:0

addtocart = (quantity,item) ->
  if quantity > 0
    if cart?
      existingitem = itemincart item.itemcode
      if  !existingitem
        cart.items.push {quantity: quantity, item:item}
      else
        existingitem.quantity += quantity
      adjusttotals quantity,item.price
      sendmessage quantity + " of " + item.displayname + " added to your cart.","info"
    else
      cart =
        items:[]
        totalitems:0
        totalprice:0
      sendmessage("Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.","error");

removefromcart = (quantity,item) ->
  if quantity > 0
    if cart?
      existingitem = itemincart item.itemcode
      if  !existingitem
        sendmessage "There are no " + item.displayname +  "s in your cart.", "warning"
      else if existingitem.quantity < quantity
        sendmessage "You don't have that many of the " + item.displayname + " in your cart.", "warning"
      else
        if existingitem.quantity is quantity
          index = itemindex item.itemcode
          if index >= 0
            cart.items.splice index,1
            sendmessage "We've removed all remaining " + item.displayname + "s from your cart.","info"
        else
          existingitem.quantity -= quantity
          sendmessage quantity + " of " + item.displayname + " removed from your cart.","info"
        adjusttotals (-quantity),(-item.price)

    else
      cart =
        items:[]
        totalitems:0
        totalprice:0
      sendmessage 'Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.', "error"

adjusttotals = (quantity,price) ->
  cart.totalitems += quantity
  cart.totalprice += quantity * price

itemincart = (itemcode) ->
  index = itemindex itemcode
  if index is -1
    return null
  else
    return cart.items[index]

itemindex = (itemcode) ->
  for i in [0...cart.items.length]
    if cart.items[i].item.itemcode is itemcode then return i
  return -1

sendmessage = (message, style) ->
  if style is "info"
    $.jnotify message
  else
    $.jnotify message,style