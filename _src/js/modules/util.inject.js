'use strict';

!function($) {

class Inject {
  constructor(parentElement, options = {}) {
    this.$element = parentElement.find(`[${this.options.dataAttr}]`);
    this.path = this.$element.attr(`[${this.options.dataAttr}]`);
    this.statusAttr = `[${this.options.dataAttr}-status]`;
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
}
}(jQuery);
