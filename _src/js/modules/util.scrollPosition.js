'use strict';

!function($) {

class ScrollPosition {
  constructor(element) {
    this.$element = element;
    this.$window = $(window);
    this.position = 0;
    this.lastPosition = 0;
    this.bindEvents();
  }
  updatePosition(event) {
    this.position = this.getPosition(event);
    // this.injectPositionValue();
    // console.log(this.position, 'scrolled');
  }
  getPosition() {
    return this.$window.scrollTop();
  }
  bindEvents() {
    this.$window.scroll(() => this.updatePosition());
  }
  // injectPositionValue() {
  //   this.$element.attr('data-scroll', this.position);
  // }
  setLastPosition() {
    this.lastPosition = this.position;
  }
  restoreLastPosition() {
    this.$window.scrollTop(this.lastPosition);
  }
}

Gingabulous.ScrollPosition = ScrollPosition;

}(jQuery);
