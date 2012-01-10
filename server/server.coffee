# TODO: Look at frameworks that use node.js for cookies/sessions, persistence, etc. Node.js is *raw*
#   https://github.com/senchalabs/connect
#   http://expressjs.com/guide.html
#   http://geddyjs.org/
# TODO: Perf this whole thing:
#   Concat/minify/gzip all js and css
#   Point to CDN where possible
#   'Expires' header (maybe frameworks above will help?)
#   Look @ cookies situation

http = require 'http'
fs = require 'fs'
path = require 'path'

server = http.createServer (request, response) ->
  console.log 'Request starting: ' + request.headers.cookie
  filePath = '.' + request.url.split("?")[0]
  cartid = getcartid request
  if filePath is './' then filePath = './TCWHome.html'
  extension = path.extname filePath
  contentType = 'text/html'
  switch extension
    when '.js' then contentType = 'text/javascript'
    when '.css' then contentType = 'text/css'
  path.exists filePath, (exists) ->
    if exists
      fs.readFile filePath, (error, content) ->
        if error
          response.writeHead 500
          response.end()
        else
          response.writeHead 200,
          if iscookieset(request.headers.cookie,cartid) or contentType isnt 'text/html' then {'Content-Type': contentType}
          else {'Content-Type': contentType,'Set-Cookie': 'cartid=' + cartid}
          response.end content, 'utf-8'
    else
      response.writeHead 404
      response.end()
server.listen 80

nowjs = require 'now'
everyone = nowjs.initialize server

nowjs.on 'connect', ->
  this.now.cartsession = "nosession"
  nowjs.getGroup(this.now.cartsession).addUser(this.user.clientId)

everyone.now.claimcart = (cartid) ->
  nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId)
  nowjs.getGroup(cartid).addUser(this.user.clientId)
  this.now.cartsession = cartid
  if not nowjs.getGroup(this.now.cartsession).now.cart?
    nowjs.getGroup(this.now.cartsession).now.cart = createCart(cartid)
  this.now.updatecart()

everyone.now.updatecarts = () ->
  if this.now.cartsession isnt "nosession"
    nowjs.getGroup(this.now.cartsession).now.updatecart()

createCart = (cartid) ->
  _cart =
  items: []
  totalprice: 0
  totalitems: 0
  cartid: cartid
  api = {}
  api.add = (quantity,item) ->
    existingitem = itemincart item.itemcode,_cart
    if  !existingitem
      _cart.items.push {quantity: quantity, item:item}
    else
      existingitem.quantity += quantity
    _cart.totalitems += quantity
    _cart.totalprice += quantity * item.price
    sendmessage _cart.cartid,quantity + " of " + item.displayname + " added to your cart.","info"
  api.remove = (quantity,item) ->
    existingitem = itemincart item.itemcode,_cart
    if  !existingitem
      sendmessage _cart.cartid,"Attempted to remove " + quantity + " of " + item.displayname + " from your cart. There are no " + item.displayname +  "s in your cart.", "warning"
    else if existingitem.quantity < quantity
      sendmessage _cart.cartid,"Attempted to remove " + quantity + " of " + item.displayname + " from your cart. You don't have that many of the " + item.displayname + " in your cart.", "warning"
    else
      if existingitem.quantity is quantity
        index = itemindex item.itemcode,_cart
        if index >= 0
          _cart.items.splice index,1
          sendmessage _cart.cartid,"We've removed all remaining " + item.displayname + "s from your cart.","info"
      else
         existingitem.quantity -= quantity
         sendmessage _cart.cartid,quantity + " of " + item.displayname + " removed from your cart.","info"
      _cart.totalitems -= quantity
      _cart.totalprice += -quantity * item.price
  api.get = (callback) ->
    callback(_cart)
  return api

itemincart = (itemcode,cart) ->
  index = itemindex itemcode,cart
  if index is -1
    return null
  else
    return cart.items[index]

itemindex = (itemcode,cart) ->
  for i in [0...cart.items.length]
    if cart.items[i].item.itemcode is itemcode then return i
  return -1

sendmessage = (cartid,message,style) ->
  nowjs.getGroup(cartid).now.presentmessage(message,style)

iscookieset = (cookies,cartid) ->
  if cookies? then cookiecartid = getcookie 'cartid',cookies
  if cookiecartid is cartid then return true
  else return false

getcookie = (name,cookies) ->
  namestr = name + "="
  if cookies?
    cookie_array = cookies.split(';')
    for cookie in cookie_array
      cookie = cookie.substring(1, cookie.length) while (cookie.charAt(0) == ' ')
      return cookie.substring(namestr.length, cookie.length) if cookie.indexOf(namestr) == 0
  return null

getParameterByName = (name,urlparams) ->
  params = urlparams.split '&'
  for param in params
    keyvalpair=param.split "="
    if keyvalpair[0] is name then return keyvalpair[1]
  return null

getcartid = (request) ->
  urlParams = request.url.split('?')[1]
  if urlParams? then cartid = getParameterByName 'cartid',urlParams
  if cartid? and cartid.length > 0 then return cartid
  cartid = getcookie 'cartid',request.headers.cookie
  if cartid? and cartid.length > 0 then return cartid
  return getguid()

getguid = () ->
  S4 = () ->
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
  return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4())