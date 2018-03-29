'use strict';
!function() {
// need a range for each layer.
// need to scale each layer based on layer order.
// need the scroll event
// - detect scroll up and scroll down

/**
 * @module backgorund
 */

class Background {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
    this.scrollDirection = new Gingabulous.ScrollDirection();
    this.content = document.querySelector(this.options.contentTarget);
  }
  get defaults() {
    return {
      dataAttr:      Gingabulous.modules.Background.dataAttr,
      contentTarget: '.site-wrapper',
      scrollRatio:   5
    };
  }
  get calculatedLayerHeight() {
    if (this.options.scrollRatio === false) {
      return this.content.offsetHeight;
    }
    return this.content.offsetHeight / 3;
  }
  init() {
    this._setLayerHeight();
    this._events();
  }
  _setLayerHeight() {
    let layers = this.element.querySelectorAll('.layer');

    for (let i = 0; i < layers.length; i++) {
      layers[i].style.height = this.calculatedLayerHeight;
    }
  }
  _syncScrolling() {
    let currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (this.options.scrollRatio === false) {
      this.element.scrollTop = currentScrollPosition;
    } else {
      this.element.scrollTop = currentScrollPosition / this.options.scrollRatio;
    }

    // console.log(window.pageYOffset, this.element.scrollTop);
  }
  _events() {
    Gingabulous.events.scroll.registerCallback(() => this._syncScrolling());
  }
}
Gingabulous.registerModule(Background);
Gingabulous.registerGlobalEventListener('scroll', document);
}();
