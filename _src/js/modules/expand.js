'use strict';

class Expand {

  get elementPosition() {
    return this.$element.position();
  }
  get $openElement() {
    return this.$element.children('.tab').children('[data-expand-open]');
  }
  get $closeElement() {
    return this.$element.children('.tab').children('[data-expand-close]');
  }
  // get tabElement() {}
  get elementHeight() {
    return this.$openElement.height();
  }
  get topbarHeight() {
    return $('header.site-header').height();
  }
  get distanceToMove() {
    return this.elementPosition.top - this.topbarHeight;
  }
  get transform() {
    return {transform: `translate(0, -${this.distanceToMove}px)`};
  }
  constructor(element, options) {
    this.$element = element;
    this.options = options || {};
  }
  openEvent() {
    this.$element.css(this.transform).addClass('active');
  }
  closeEvent() {
    this.$element.css({transform: `translate(0, 0)`}).removeClass('active');
  }
  bindEvents() {
    this.$openElement.click(() => this.openEvent());
    this.$closeElement.click(() => this.closeEvent());
  }
}

function initExpands() {
  let $expandElements = $('[data-expand]');

  $expandElements.each(function() {
    let expand = new Expand($(this));
    expand.bindEvents();
  });
}

$(document).ready(function() {
  initExpands();
});
