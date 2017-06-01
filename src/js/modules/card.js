!function() {

class Card {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
  }
  get defaults() {
    return {
      dataAttr: Gingabulous.modules.Card.dataAttr,
      classes: {
        expand: 'expanded'
      }
    };
  }
  get classes() {
    return this.options.classes;
  }
  get attr() {
    return {
      card:  this.options.dataAttr,
      close: `${this.options.dataAttr}-close`
    };
  }
  _expand() {
    this.element.classList.add(this.classes.expand);
  }
  _collapse() {
    this.element.classList.remove(this.classes.expand);
  }
  _event() {
    this.element.addEventListener('click', (event) => {
      if (!this.element.classList.contains(this.classes.expand)) {
        this._expand();
      }
      if (this.element.classList.contains(this.classes.expand)) {
        if (event.target.hasAttribute(this.attr.close)) {
          this._collapse();
        }
      }
    });
  }
}
Gingabulous.registerModule(Card);
}();
