!function($) {

class Card {
  get defaults() {
    return {
      dataAttr:      Gingabulous.modules.Card.dataAttr,
      expandClass:   'expanded',
      coverClass:    'card-cover',
      collapseClass: 'card-collapse'
    };
  }
  get $expandElement() {
    let child = `.${this.options.coverClass}`;
    return this.$element.find(child);
  }
  get $collapseElement() {
    let child = `.${this.options.collapseClass}`;
    return this.$element.find(child);
  }
  constructor(element, options = {}) {
    this.$element = element;
    this.options = $.extend(true, this.defaults, options);
  }

  expandCard() {
    this.$element.addClass(this.options.expandClass);
    console.log('open');
  }
  collapseCard() {
    this.$element.removeClass(this.options.expandClass);
  }

  bindEvents() {
    this.$expandElement.click(() => this.expandCard());
    this.$collapseElement.click(() => this.collapseCard());
  }
}

Gingabulous.registerModule(Card);

}(jQuery);
