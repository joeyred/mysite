'use strict';
!function($) {
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
  get isActive() {
    return this.resp.active();
  }
  constructor(element, options) {
    this.$element = element;
    this.options = options || {};
    this.resp = new Gingabulous.Responsive(element);
  }
  openEvent() {
    console.log(this.isActive);
    if (this.isActive) {
      this.$element.css(this.transform).addClass('active');
      this.$element.children('.tab-content').css({height: `${this.contentHeight}px`});
    }
  }
  closeEvent() {
    if (this.isActive) {
      this.$element.removeAttr('style').removeClass('active');
      this.$element.children('.tab-content').css({height: `0px`});
    }
  }
  bindEvents() {
    this.$openElement.click(() => this.openEvent());
    this.$closeElement.click(() => this.closeEvent());
  }
}

Gingabulous.registerModule(Expand);

// function initExpands() {
//   var $expandElements = $('[data-expand]');
//
//   $expandElements.each(function() {
//     var expand = new Expand($(this));
//     expand.bindEvents();
//   });
// }
//
// $(document).ready(function() {
//   initExpands();
// });

}(jQuery);
