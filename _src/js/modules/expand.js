'use strict';

function Expand(element, options) {
  this.$element = element;
  this.options = options || {};
}

Expand.prototype = {
  constructor: Expand,

  openEvent: function() {
    console.log('open now');
    this.$element.addClass('active');
  },
  closeEvent: function() {
    this.$element.removeClass('active');
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
