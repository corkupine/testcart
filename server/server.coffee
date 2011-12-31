http = require 'http'
fs = require 'fs'
path = require 'path'

server = http.createServer (request, response) ->
  console.log '[server.coffee] request starting...'
  filePath = '.' + request.url
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
          response.writeHead 200, { 'Content-Type': contentType, 'Set-Cookie': 'fakeCartSession=XYZ123' }
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

everyone.now.claimCart = (newCart) ->
  nowjs.getGroup(this.now.cartsession).removeUser(this.user.clientId)
  nowjs.getGroup(newCart).addUser(this.user.clientId)
  this.now.cartsession = newCart
#  Here is where I have send over the cart info
#  this.now.receiveMessage("server", "You have claimed cart " + this.now.cartsession)

everyone.now.addtocarts = (quantity,item) ->
#  if this.now.cartsession isnt "nosession"
  nowjs.getGroup(this.now.cartsession).now.addtocart(quantity, item)

everyone.now.removefromcarts = (quantity,item) ->
#  if this.now.cartsession isnt "nosession"
  nowjs.getGroup(this.now.cartsession).now.removefromcart(quantity, item)