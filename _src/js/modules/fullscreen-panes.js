!function($) {

class Panes {

  get defaults() {
    return {
      dataAttr:     Gingabulous.modules.Panes.dataAttr,
      paneDataAttr: 'data-pane'
    };
  }
  get id() {
    return this.$element.attr(this.options.dataAttr);
  }
  get $panesNav() {
    return $(`[${this.options.dataAttr}-nav="${this.id}"]`);
  }

  constructor(element, options = {}) {
    this.$element = element;
    this.options = $.extend(true, this.defaults, options);
  }

  buttonTarget(id) {
    return this.$panesNav.children(`[${this.options.paneDataAttr}-go="${id}"]`);
  }

  goToLeft() {
    this.$element.css({transform: `translateX(0)`});
  }
  goToCenter() {
    this.$element.css({transform: `translateX(-100%)`});
  }
  goToRight() {
    this.$element.css({transform: `translateX(-200%)`});
  }

  bindEvents() {
    this.buttonTarget('left').click(() => this.goToLeft());
    this.buttonTarget('center').click(() => this.goToCenter());
    this.buttonTarget('right').click(() => this.goToRight());
  }
}

Gingabulous.registerModule(Panes);

}(jQuery);
