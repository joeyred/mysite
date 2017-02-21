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
  get elementMarginOnMove() {
    let margin =  Number(this.elementMargin);
    return this.distanceToMove - margin;
  }
  get contentHeight() {
    return $(window).height() - (this.topbarHeight + this.elementHeight) - 36;
  }
  get transform() {
    return {
      transform: `translate(0, -${this.distanceToMove}px)`,
      margin:    `0 0 -${this.elementMarginOnMove}px`
    };
  }
  get isActive() {
    return this.resp.active();
  }
  constructor(element, options) {
    this.$element = element;
    this.elementMargin = element.css('marginBottom').replace(/[^-\d.]/g, '');
    this.options = options || {};
    this.resp = new Gingabulous.Responsive(element);
  }
  openEvent() {
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

}(jQuery);
