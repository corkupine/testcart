(function() {
  var gallery, galleryfadespeed;

  jQuery().ready(function($) {
    return $('div.thumbnail').click(function() {
      return gallery($(this));
    });
  });

  galleryfadespeed = 300;

  gallery = function(element) {
    var fadediv, gallerydiv;
    gallerydiv = document.createElement('div');
    $(gallerydiv).prepend('<p>Click to Close</p><img src="images/' + $(element).attr('id') + '_500.png"/>');
    gallerydiv.id = 'gallery';
    gallerydiv.className = 'gallerycontent';
    gallerydiv.onclick = function() {
      $('#fade').fadeOut(galleryfadespeed).remove();
      return $('#gallery').fadeOut(galleryfadespeed).remove();
    };
    fadediv = document.createElement('div');
    fadediv.id = 'fade';
    fadediv.className = 'faded';
    $('body').prepend(gallerydiv).prepend(fadediv);
    $('#gallery').fadeIn(galleryfadespeed);
    return $('#fade').fadeIn(galleryfadespeed);
  };

}).call(this);
