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
  get contentHeight() {
    return $(window).height() - (this.topbarHeight + this.elementHeight) - 36;
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
    this.$element.children('.tab-content').css({height: `${this.contentHeight}px`});
  }
  closeEvent() {
    this.$element.removeAttr('style').removeClass('active');
    this.$element.children('.tab-content').css({height: `0px`});
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