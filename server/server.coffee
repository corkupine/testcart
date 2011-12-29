http = require('http')
fs = require('fs')
path = require('path')

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
          response.writeHead 200, { 'Content-Type': contentType }
          response.end content, 'utf-8'
    else
      response.writeHead 404
      response.end()
server.listen 80

#TODO: Add some fake cart ID to headers to manage sessions as a group
#TODO: Nowjs stuff