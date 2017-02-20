!function($) {
console.log(Gingabulous);
function init() {
  var $siteInner = $('.site-inner');
  $(Gingabulous.modules.Overlay.dataAttrTarget).each(function() {
    var $overlay = $(this);
    var id = $overlay.attr('data-overlay');
    var overlay = new Gingabulous.Overlay($overlay, $siteInner, id);

    overlay.bindOpenEvent();
    overlay.bindCloseEvent();
  });
}

init();
}(jQuery);
