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
    this.innerElement = element.firstChild;
    this.scrollDirection = new Gingabulous.ScrollDirection();
    this.content = document.querySelector('.site-wrapper');
    this.scrollTop = this.element.scrollTop;
  }
  init() {
    this._events();
  }
  _distancePerDocumentScroll() {
    // console.log(this.element.offsetHeight, this.content.offsetHeight);
    return Math.ceil(this.element.offsetHeight / this.content.offsetHeight);
  }
  _updateScrollPosition() {
    if (this.scrollDirection.down()) {
      this.scrollTop += this._distancePerDocumentScroll();
      console.log(this.scrollTop);
    } else {
      this.scrollTop -= this._distancePerDocumentScroll();
      console.log(this.scrollTop);
    }
    // if (this.scrollDirection.up()) {
    //   this.scrollTop -= this._distancePerDocumentScroll();
    //   console.log(this.scrollTop);
    // }
    this.element.scrollTop = this.scrollTop;
    console.log(`ScrollTop: ${this.element.scrollTop}`);
  }
  _syncScrolling() {
    let currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.element.scrollTop = currentScrollPosition;
    // this.innerElement.scrollTop = currentScrollPosition;
    console.log(this.innerElement.scrollTop, this.element.scrollTop);
  }
  _events() {
    Gingabulous.events.scroll.registerCallback(() => this._syncScrolling());
  }
}
Gingabulous.registerModule(Background);
Gingabulous.registerGlobalEventListener('scroll', document);
}();
