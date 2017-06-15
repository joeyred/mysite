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

  $(Gingabulous.modules.Expand.dataAttrTarget).each(function() {
    var expand = new Gingabulous.Expand($(this));
    expand.bindEvents();
  });
  var panesNode = document.querySelector(Gingabulous.modules.Panes.dataAttrTarget);
  var panes = new Gingabulous.Panes(panesNode);
  panes.init();
}

Gingabulous.Debug.config(true, {
  Pane:         true,
  DynamicPane:  true,
  CarouselPane: true
});

init();
}(jQuery);
