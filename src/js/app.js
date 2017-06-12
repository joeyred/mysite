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
function initCards() {
  let cards = document.querySelectorAll(Gingabulous.modules.Card.dataAttrTarget);
  for (let i = 0; i < cards.length; i++) {
    let module = new Gingabulous.Card(cards[i]);
    module.init();
    console.log(`init card: ${i}`);
  }
}

init();
initCards();
}(jQuery);
