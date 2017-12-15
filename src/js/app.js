!function($) {
console.log(Gingabulous);
function init() {
  var panesNode = document.querySelector(Gingabulous.modules.Panes.dataAttrTarget);
  var panes = new Gingabulous.Panes(panesNode);
  panes.init();

  let backgroundNode = document.querySelector(Gingabulous.modules.Background.dataAttrTarget);
  let background = new Gingabulous.Background(backgroundNode);
  background.init();

  let expandableNodes = document.querySelector(Gingabulous.modules.Expand.dataAttrTarget);
  let expand = new Gingabulous.Expand(expandableNodes);
  expand.init();
}
function initCards() {
  let cards = document.querySelectorAll(Gingabulous.modules.Card.dataAttrTarget);
  for (let i = 0; i < cards.length; i++) {
    let module = new Gingabulous.Card(cards[i]);
    module.init();
    console.log(`init card: ${i}`);
  }
}

Gingabulous.registerGlobalEventListener('resize', window);
// Gingabulous.events.resize.registerCallback(function() {
//   console.log('Window Resized');
// });

Gingabulous.Debug.config(true, {
  Pane:         true,
  DynamicPane:  true,
  CarouselPane: true
});
init();
initCards();
}(jQuery);
