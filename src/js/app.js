!function($) {
console.log(Gingabulous);
function init() {
  var panesNode = document.querySelector(Gingabulous.modules.Panes.dataAttrTarget);
  var panes = new Gingabulous.Panes(panesNode);
  panes.init();

  let backgroundNode = document.querySelector(Gingabulous.modules.Background.dataAttrTarget);
  let background = new Gingabulous.Background(backgroundNode);
  background.init();

  let cards = document.querySelectorAll(Gingabulous.modules.Card.dataAttrTarget);
  for (let i = 0; i < cards.length; i++) {
    let module = new Gingabulous.Card(cards[i]);
    module.init();
    console.log(`init card: ${i}`);
  }

  let expandableNodes = document.querySelectorAll(Gingabulous.modules.Expand.dataAttrTarget);
  for (let i = 0; i < expandableNodes.length; i++) {
    let expand = new Gingabulous.Expand(expandableNodes[i]);
    expand.init();
  }
}
// function initCards() {
//   let cards = document.querySelectorAll(Gingabulous.modules.Card.dataAttrTarget);
//   for (let i = 0; i < cards.length; i++) {
//     let module = new Gingabulous.Card(cards[i]);
//     module.init();
//     console.log(`init card: ${i}`);
//   }
// }

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
// initCards();
}(jQuery);
