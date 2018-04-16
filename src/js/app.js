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
    // console.log(`init card: ${i}`);
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

Gingabulous.registerAnimation('expandingTabs', (element) => {
  if (!element.querySelector('.animation_border-left')) {
    // add dummy element for animating the border
    const border = document.createElement('div');
    border.classList.add('animation_border-left');
    element.appendChild(border);
  }
  const wrapperElement = document.querySelector('.site-inner main.content');

  const state = element.getAttribute('data-expand');
  const animationClass = 'animation_expanding-tabs';
  const expandBase = `${animationClass}_expand`;
  const collapseBase = `${animationClass}_collapse`;

  const topbarHeight = 40;
  const positionTop = element.getBoundingClientRect().top;
  // const tabHeight = element.querySelector('.titled-callout-heading').offsetHeight;
  // const windowHeight = window.innerHeight ||
  //   document.documentElement.clientHeight ||
  //   document.body.clientHeight;
  // console.log(positionTop);

  wrapperElement.classList.add('animation_expanding-tabs_in-progress');

  // EXPAND
  if (state === 'expanded') {
    wrapperElement.classList.add('animation_expanding-tabs_tab-active');
    element.classList.remove(
      `${collapseBase}_collapse-border_transition`,
      `${collapseBase}_collapse-border_animate`
    );

    element.classList.remove(
      `${collapseBase}_shift-down_transition`,
      `${collapseBase}_shift-down_animate`
    );

    Gingabulous.animationSeries(
      element,
      'expanding-tabs_expand',
      {
        after: () => {
          wrapperElement.classList.remove('animation_expanding-tabs_in-progress');
        }
      },
      [
        'shift-up',
        600,
        (element) => {
          element.style.transform = `translateY(-${positionTop - topbarHeight}px)`;
        }
      ],
      ['expand-border', 300]
    );
  }

  // COLLAPSE
  if (state === 'collapsed') {
    element.classList.remove(
      `${expandBase}_shift-up_transition`,
      `${expandBase}_shift-up_animate`
    );

    element.classList.remove(
      `${expandBase}_expand-border_transition`,
      `${expandBase}_expand-border_animate`
    );

    Gingabulous.animationSeries(
      element,
      'expanding-tabs_collapse',
      {
        after: () => {
          wrapperElement.classList.remove('animation_expanding-tabs_tab-active');
          wrapperElement.classList.remove('animation_expanding-tabs_in-progress');
        }
      },
      [
        'collapse-border',
        300
      ],
      [
        'shift-down',
        600,
        (element) => {
          element.style.transform = null;
        }
      ]
    );
  }
});

// let time = 0;
// setInterval(() => {
//   time += 100;
// }, 100);

Gingabulous.animationSeries(
  document.querySelector('.loading-screen'),
  'loading-screen',
  false,
  [
    'step-1',
    600
  ],
  [
    'step-2',
    200
  ],
  [
    'final',
    200
  ]
);
// Gingabulous.Debug.timer(6000);
init();
// initCards();
}(jQuery);
