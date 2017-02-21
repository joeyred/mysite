'use strict';

!function($) {

class FullPage {
  get windowDimensions() {
    let height = this.$window.height();
    let width =  this.$window.width();

    return {height, width};
  }
  get stylesObject() {
    let position = 'fixed';
    let height = this.windowDimensions.height;
    let width = this.windowDimensions.width;

    return {position, height, width};
  }
  constructor(element) {
    this.$element = element;
    this.$window = $(window);
  }
  applyFixedDimentions() {
    this.$element.css(this.stylesObject);
  }
}

Gingabulous.registerModule(FullPage);
}(jQuery);
