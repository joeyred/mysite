!function($) {

class CarouselPanes {

  constructor(element, dataAttr) {
    this.$element  = element;
    this.dataAttr  = dataAttr;
    this.$carousel = element.children(`[${dataAttr}]`);

    console.log(element, dataAttr, this.$carousel);
  }
  button(id) {
    console.log(`[${this.dataAttr}-nav="${id}"]`);
    return this.$element.find(`[${this.dataAttr}-nav="${id}"]`);
  }
  goToLeft() {
    this.$carousel.css({transform: `translateX(0)`});
  }
  goToCenter() {
    this.$carousel.css({transform: `translateX(-100%)`});
  }
  goToRight() {
    this.$carousel.css({transform: `translateX(-200%)`});
  }
  bindEvents() {
    console.log('bind stuff', this.button('left'), this.button('center'), this.button('right'));
    this.button('left').click(() => this.goToLeft());
    this.button('center').click(() => this.goToCenter());
    this.button('right').click(() => this.goToRight());
  }
}

// Gingabulous.registerChildModule('Panes', CarouselPanes);

}(jQuery);
