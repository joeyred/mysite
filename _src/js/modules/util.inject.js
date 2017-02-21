'use strict';

!function($) {

class Inject {
  constructor(parentElement, options = {}) {
    this.$element = parentElement.find(`[${this.options.dataAttr}]`);
    this.path = this.$element.attr(`${this.options.dataAttr}`);
    this.statusAttr = `${this.options.dataAttr}-status`;
    this.xhr = new XMLHttpRequest();
    this.options = $.extend(true, this.defaults, options);
    this.defaults = {
      dataAttr:       'data-inject',
      dataAttrStatus: {
        noContent: 'no content',
        loaded:    'loaded',
        unloaded:  'unloaded'
      }
    };
  }
  contentHasLoaded() {
    if (this.currentStatusAttrValue() === this.options.dataAttrStatus.loaded) {
      return true;
    }
    return false;
  }
  contentIsReady() {
    return this.xhr.readyState === 4;
  }
  currentStatusAttrValue() {
    return this.$element.attr(this.statusAttr);
  }
  updateStatusAttr(status) {
    this.$element.attr(this.statusAttr, status);
  }

}
}(jQuery);
