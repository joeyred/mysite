'use strict';
!function() {
function generateUID() {
  return Math.round((Math.pow(32, 7) - (Math.random() * Math.pow(32, 6)))).toString();
}
class Expand {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, Expand.defaults(), options);
    this.uid = generateUID();
    // console.log(this.uid);
    this.responsive = new Gingabulous.Responsive(element);
    this.animation = element.hasAttribute('data-animation') ?
      element.getAttribute('data-animation') :
      false;
    // console.log(this.animation);
    //   console.log(element.hasAttribute('data-animation'));
    //   console.log(element.getAttribute('data-animation'));
    //   console.log(Gingabulous.animations[element.getAttribute('data-animation')]);
    // console.log(animationFunc);
  }
  static defaults() {
    return {
      dataAttr:      Gingabulous.modules.Expand.dataAttr,
      class:         'expandable',
      type:          'basic',
      defaultState:  'collapsed',
      inactiveState: 'inactive',
      states:        {
        expanded:  'expanded',
        collapsed: 'collapsed'
      },
      animation: null
    };
  }
  get classes() {
    return {
      expand: this.options.class
    };
  }
  get attr() {
    return {
      expand:  this.options.dataAttr,
      uid:     `${this.options.dataAttr}-uid`,
      open:    `${this.options.dataAttr}-open`,
      close:   `${this.options.dataAttr}-close`,
      content: `${this.options.dataAttr}-content`
    };
  }
  init() {
    // console.log('active on init:', this.responsive.isActive());
    this._setUID();
    // Set Default State
    if (this.responsive.isActive()) {
      this._setState(this.options.defaultState);
    } else {
      this._setState(this.options.inactiveState);
    }
    if (!!this.animation && Gingabulous.animations[this.animation].setup !== null) {
      Gingabulous.animations[this.animation].setup(this.element);
    }
    // Handle Events
    this._events();
  }
  _setUID() {
    this.element.setAttribute(this.attr.uid, this.uid);
    this.element.querySelector(`[${this.attr.open}]`).setAttribute(this.attr.open, this.uid);
    this.element.querySelector(`[${this.attr.close}]`).setAttribute(this.attr.close, this.uid);
  }
  _setState(state) {
    this.element.setAttribute(this.attr.expand, state);
  }
  _onResize() {
    if (this.responsive.windowWidthWasResized()) {
      if (this.responsive.isActive()) {
        // If current state doesnt match default state, then set state to default state.
        if (this.element.getAttribute(this.attr.expand) !== this.options.defaultState) {
          this._setState(this.options.defaultState);
        }
      }
      if (!this.responsive.isActive()) {
        if (this.element.getAttribute(this.attr.expand) !== this.options.inactiveState) {
          this._setState(this.options.inactiveState);
        }
      }
    }
  }
  _eventMatches(dataAttr, event) {
    // Find the first element with the data attr
    const element = this.element.querySelector(`[${dataAttr}]`);

    // These two conditions only exist due to the chance that `event.target.path`
    // is not supported and a polyfill is used instead.
    let conditionOne = false;
    let conditionTwo = false;

    // polyfill for Safari
    const findElementWithDataAttr = (_element) => {
      if (
        _element.hasAttribute(dataAttr) &&
        _element.getAttribute(dataAttr) === this.uid
      ) {
        conditionTwo = true;
      } else {
        findElementWithDataAttr(_element.parentNode);
      }
    };

    if (event.target.hasAttribute(dataAttr)) {
      if (event.target.getAttribute(dataAttr) === this.uid) {
        conditionOne = true;
      }
    }

    if (element.contains(event.target)) {
      // No support in safari
      if (event.target.path) {
        for (let i = 0; i < event.path.length; i++) {
          if (
            event.path[i].hasAttribute(dataAttr) &&
            event.path[i].getAttribute(dataAttr) === this.uid
          ) {
            conditionTwo = true;
            break;
          }
        }
      // This should work for browsers that don't support `event.target.path`
      } else {
        findElementWithDataAttr(event.target);
      }
    }

    return conditionOne || conditionTwo;
  }
  _events() {
    // Resize Events
    if (!Gingabulous.events.resize) {
      Gingabulous.registerGlobalEventListener('resize', window);
    }
    Gingabulous.events.resize.registerCallback(() => this._onResize());

    // Click Events
    this.element.addEventListener('click', (event) => {
      console.log(event);
      // console.log(event.target.offsetParent.getAttribute(this.attr.uid));
      // console.log(this.uid);
      // if (
      //   this.responsive.isActive() &&
      //   event.target.offsetParent.getAttribute(this.attr.uid) === this.uid
      // ) {
      if (this.responsive.isActive()) {
        // console.log(event.target.hasAttribute(this.attr.open));
        // Open Event
        if (this._eventMatches(this.attr.open, event)) {
          // console.log('fired open event');
          this._setState(this.options.states.expanded);

          // Handle custom animation functions
          if (!!this.animation) {
            Gingabulous.animations[this.animation].animate(this.element);
          }
        }

        // Close Event
        if (this._eventMatches(this.attr.close, event)) {
          this._setState(this.options.states.collapsed);

          // Handle custom animation functions
          if (!!this.animation) {
            Gingabulous.animations[this.animation].animate(this.element);
          }
        }
      }
    });
  }
}

// class Card extends Expand {
//   get defaults() {
//     return {
//       dataAttr:      Gingabulous.modules.Card.dataAttr,
//       class:         'expandable',
//       type:          'basic',
//       defaultState:  'collapsed',
//       inactiveState: 'inactive',
//       states:        {
//         expanded:  'expanded',
//         collapsed: 'collapsed'
//       },
//       animationFunc: null
//     };
//   }
//   init() {
//     // console.log('active on init:', this.responsive.isActive());
//     this._setUID();
//     // Set Default State
//     if (this.responsive.isActive()) {
//       this._setState(this.options.defaultState);
//     } else {
//       this._setState(this.options.inactiveState);
//     }
//     // Handle Events
//     this._events();
//   }
//   _
// }

Gingabulous.registerModule(Expand, 'Expand');
// Gingabulous.registerModule(Card, 'Card');
}();
