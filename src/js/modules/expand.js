'use strict';
!function() {
class Expand {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
  }
  get defaults() {
    return {
      dataAttr: Gingabulous.modules.Expand.dataAttr,
      class:    'expanded',
      type:     'basic'
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
    this._events();
  }
  _expand() {
    this.element.classList.add(this.classes.expand);
  }
  _collapse() {
    this.element.classList.remove(this.classes.expand);
  }
  _events() {
    this.element.addEventListener('click', (event) => {
      // Open Event
      if (event.target.hasAttribute(this.attr.open)) {
        this._expand();
      }
      // Close Event
      if (event.target.hasAttribute(this.attr.close)) {
        this._collapse();
      }
    });
  }
}

Gingabulous.registerModule(Expand);
}();
