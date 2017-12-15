'use strict';
!function() {
class Expand {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
  }
  get defaults() {
    return {
      dataAttr:     Gingabulous.modules.Expand.dataAttr,
      class:        'expandable',
      type:         'basic',
      defaultState: 'collapsed',
      states:       {
        expanded:  'expanded',
        collapsed: 'collapsed'
      }
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
    // Set Default State
    this.element.setAttribute(this.attr.expand, this.options.defaultState);
    // Handle Events
    this._events();
  }
  _setState(state) {
    this.element.setAttribute(this.attr.expand, state);
  }
  _events() {
    this.element.addEventListener('click', (event) => {
      // Open Event
      if (event.target.hasAttribute(this.attr.open)) {
        this._setState(this.options.states.expanded);
      }
      // Close Event
      if (event.target.hasAttribute(this.attr.close)) {
        this._setState(this.options.states.collapsed);
      }
    });
  }
}

Gingabulous.registerModule(Expand);
}();
