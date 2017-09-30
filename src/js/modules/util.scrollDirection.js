!function() {
class ScrollDirection {
  constructor() {

    this.lastScrollPosition = 0;
    // 0 = down and 1 = up
    this.lastScrollDirection = 0;
    this.i = 0;
    this.scrollingDirection = 0;
    this._event();
  }
  _update() {
    let currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Actions when scrolling down
    if (currentScrollPosition > this.lastScrollPosition) {
      console.log('down');
      if (this.lastScrollDirection !== 0) {
        this.i += 1;
        if (this.i >= 10) {
          this.i = 0;
          this.lastScrollDirection = 0;
        }
      }
    // Actions when scrolling up
    } else {
      console.log('up');
      if (this.lastScrollDirection !== 1) {
        if (this.i >= 10) {
          this.i = 0;
          this.lastScrollDirection = 1;
        }
        this.i += 1;
      }
    }
    this.lastScrollPosition = currentScrollPosition;
  }
  _event() {
    Gingabulous.events.scroll.registerCallback(() => this._update());
  }
  down() {
    if (this.lastScrollDirection === 0) {
      return true;
    }
    return false;
  }
  up() {
    if (this.lastScrollDirection === 1) {
      return true;
    }
    return false;
  }
}
Gingabulous.ScrollDirection = ScrollDirection;
}();
