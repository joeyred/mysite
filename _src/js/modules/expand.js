'use strict';

function Expand(element, options) {
  this.$element = element;
  this.options = options || {};
  this.originalPosition = this.getElementPosition();
}

Expand.prototype = {
  constructor: Expand,

  // Get position of element
  getElementPosition: function() {
    return this.$element.offset();
  },
  // Get height usable space
    // Get height of viewport
    // Get height of topbar
    // Subtract topbar from viewport to get usable height.

  openEvent: function() {
    console.log('open now');
    let position = this.originalPosition;
    let destination = {top: 0};
    console.log(position);
    this.$element.css(this.originalPosition).css(destination).addClass('active');
  },
  closeEvent: function() {
    this.$element.removeClass('active').css(this.originalPosition);
  },
  bindEvents: function() {
    let $elementToBind = this.$element.children('.titled-callout-title');
    console.log(this.$element.children('.titled-callout-title'));
    $elementToBind.children('h2').click(() => this.openEvent());
    $elementToBind.children('[data-expand-close]').click(() => this.closeEvent());
  }
};

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
