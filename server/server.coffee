# TODO: Set up cart sync between sessions - use cart id to make sure it's the same cart,
#       update local cart if you just opened window and cart in a different window already
#       has items, etc.

http = require 'http'
fs = require 'fs'
path = require 'path'


server = http.createServer (request, response) ->
  console.log '[server.coffee] request starting...'
  console.log request.headers.cookie
  filePath = '.' + request.url.split("?")[0]
  console.log filePath
  cartid = getcartid request
  if filePath is './' then filePath = './TCWHome.html'
  extension = path.extname filePath
  contentType = 'text/html'
  switch extension
    when '.js' then contentType = 'text/javascript'
    when '.css' then contentType = 'text/css'
  path.exists filePath, (exists) ->
    if exists
      console.log 'Path exists'
      fs.readFile filePath, (error, content) ->
        if error
          response.writeHead 500
          response.end()
        else
          response.writeHead 200,
          if iscookieset(request.headers.cookie,cartid) then {'Content-Type': contentType}
          else {'Content-Type': contentType,'Set-Cookie': 'cartid=' + cartid}
          response.end content, 'utf-8'
    else
      console.log 'Path does not exist'
      response.writeHead 404
      response.end()
server.listen 80

nowjs = require 'now'
everyone = nowjs.initialize server

nowjs.on 'connect', ->
  this.now.cartsession = "nosession"
  nowjs.getGroup(this.now.cartsession).addUser(this.user.clientId)

everyone.now.claimcart = (newCart) ->
  nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId)
  nowjs.getGroup(newCart).addUser(this.user.clientId)
  this.now.cartsession = newCart
#  nowjs.getGroup(this.now.cartsession).now.claimcart(quantity, item)

everyone.now.addtocarts = (quantity,item) ->
  if this.now.cartsession isnt "nosession"
    nowjs.getGroup(this.now.cartsession).now.addtocart(quantity, item)

everyone.now.removefromcarts = (quantity,item) ->
  if this.now.cartsession isnt "nosession"
    nowjs.getGroup(this.now.cartsession).now.removefromcart(quantity, item)

iscookieset = (cookies,cartid) ->
  if cookies?
    cookiecartid = getcookie 'cartid',cookies
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