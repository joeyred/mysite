!function() {

/**
 * @module gingabulous.card
 * @requires gingabulous.util.events
 */

/**
 * @class Card
 *
 */
class Card {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
  }
  get defaults() {
    return {
      dataAttr: Gingabulous.modules.Card.dataAttr,
      classes:  {
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
  init() {
    // console.log('fired init');
    this._events();
    this._injectBorderLeft();
    this._setBorderLeft();
  }
  _elementHeight() {
    return this.element.offsetHeight;
  }
  _injectBorderLeft() {
    let html = `<div class="border-left"></div>`;
    this.element.insertAdjacentHTML('afterbegin', html);
  }
  _setBorderLeft(reducedHeight = false) {
    let borderElement = this.element.querySelectorAll('.border-left');
    // console.log(borderElement[0]);
    // console.log(this._elementHeight());
    let elementHeight = this._elementHeight();
    if (reducedHeight) {
      borderElement[0].style.height = `${elementHeight - 10}px`;
    }
    if (!reducedHeight) {
      borderElement[0].style.height = `${elementHeight}px`;
    }
  }
  _expand() {
    this.element.classList.add(this.classes.expand);
  }
  _collapse() {
    this.element.classList.remove(this.classes.expand);
  }
  _onResize() {
    if (this.element.querySelector('.border-left').offsetHeight !== this.element.offsetHeight) {
      if (this.element.classList.contains(this.classes.expand)) {
        this._setBorderLeft(true);
      } else {
        this._setBorderLeft();
      }
    }
  }
  _events() {
    // Resize event.
    if (!Gingabulous.events.resize) {
      Gingabulous.registerGlobalEventListener('resize', window);
    }
    Gingabulous.events.resize.registerCallback(() => this._onResize());
    // Opening and Closing of the card.
    this.element.addEventListener('click', (event) => {
      if (!this.element.classList.contains(this.classes.expand)) {
        this._expand();
        this._setBorderLeft(true);
      }
      if (this.element.classList.contains(this.classes.expand)) {
        if (event.target.hasAttribute(this.attr.close)) {
          this._collapse();
          this._setBorderLeft();
        }
      }
    });
  }
}
Gingabulous.registerModule(Card);
}();
