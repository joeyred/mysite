'use strict';
!function() {
class Expand {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, Expand.defaults(), options);
    this.responsive = new Gingabulous.Responsive(element);
    this.animationFunc = element.hasAttribute('data-animation') ?
      element.getAttribute('data-animation') :
      false;
    // console.log(this.animationFunc);
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
      animationFunc: null
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
      open:    `${this.options.dataAttr}-open`,
      close:   `${this.options.dataAttr}-close`,
      content: `${this.options.dataAttr}-content`
    };
  }
  init() {
    // console.log('active on init:', this.responsive.isActive());
    // Set Default State
    if (this.responsive.isActive()) {
      this._setState(this.options.defaultState);
    } else {
      this._setState(this.options.inactiveState);
    }
    // Handle Events
    this._events();
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
  _events() {
    // Resize Events
    if (!Gingabulous.events.resize) {
      Gingabulous.registerGlobalEventListener('resize', window);
    }
    Gingabulous.events.resize.registerCallback(() => this._onResize());

    // Click Events
    this.element.addEventListener('click', (event) => {
      if (this.responsive.isActive()) {

        // Open Event
        if (event.target.hasAttribute(this.attr.open)) {
          this._setState(this.options.states.expanded);

          // Handle custom animation functions
          if (!!this.animationFunc) {
            Gingabulous.animations[this.animationFunc](this.element);
          }
        }

        // Close Event
        if (event.target.hasAttribute(this.attr.close)) {
          this._setState(this.options.states.collapsed);

          // Handle custom animation functions
          if (!!this.animationFunc) {
            Gingabulous.animations[this.animationFunc](this.element);
          }
        }
      }
    });
  }
}

Gingabulous.registerModule(Expand);
}();
