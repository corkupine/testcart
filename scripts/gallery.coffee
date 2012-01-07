jQuery().ready ($) ->
  $('div.thumbnail').click () ->
    gallery $(this)

galleryfadespeed = 300
gallery = (element) ->
  gallerydiv = document.createElement 'div'
  $(gallerydiv).prepend('<p>Click to Close</p><img src="images/' + $(element).attr('id') + '_500.png"/>')
  gallerydiv.id = 'gallery'
  gallerydiv.className = 'gallerycontent'
  gallerydiv.onclick = () ->
    $('#fade').fadeOut(galleryfadespeed).remove()
    $('#gallery').fadeOut(galleryfadespeed).remove()
  fadediv = document.createElement 'div'
  fadediv.id = 'fade'
  fadediv.className = 'faded'
  $('body').prepend(gallerydiv).prepend(fadediv)
  $('#gallery').fadeIn galleryfadespeed
  $('#fade').fadeIn galleryfadespeed