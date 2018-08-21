'use strict';

!function($) {

class ScrollPosition {
  constructor(element) {
    this.$window = element;
    this.position = 0;
    this.lastPosition = 0;
    this.bindEvents();
  }
  updatePosition(event) {
    this.position = this.getPosition(event);
  }
  getPosition() {
    return this.$window.scrollTop();
  }
  bindEvents() {
    this.$window.scroll(() => this.updatePosition());
  }
  setLastPosition() {
    this.lastPosition = this.position;
  }
  restoreLastPosition() {
    this.$window.scrollTop(this.lastPosition);
  }
}

// Gingabulous.ScrollPosition = ScrollPosition;

class ScrollEmulation {
  constructor(element) {
    this.$element = element;
    this.$body = $('body');
    this.$window = $(window);
    this.lastScrollTop = 0;
    this.lastScrollDirection = '';
    this.setBodyHeight();
    this.i = 0;
  }
  setBodyHeight() {
    let height = this.$window.height() + 50;
    console.log(`%c height is ${height}`, 'color: red');
    this.$body.css({height: height});
  }
  // when scrolling down hide the adress bar
    // detect scrolling
    // check that its moving down
    // when it moves down a specific amount, scroll the body to make the adress bar go away
  // do the opposite for scrolling up
  bindEvent() {
    this.$element.scroll(() => this.event());
  }
  event() {
    // console.log('i was scrolled!');
    let st = this.$element.scrollTop();
    // use this to make it wait a few pixels before activating.
    console.log(`%c i: ${this.i}`, 'color: red');

    if (this.$body.height() !== this.$window.height() - 50) {
      this.$body.css({height: `${this.$window.height() + 50}`});
    }
    // down
    if (st > this.lastScrollTop) {
      console.log('scrolling down');
      if (this.lastScrollDirection !== 'down') {
        this.i += 1;
        if (this.i >= 10) {
          this.i = 0;
          this.lastScrollDirection = 'down';
          console.log('%c body scroll down triggered', 'color: yellow');
          // window.scrollTo(0, 10);
          this.$body.scrollTop(50);
          this.$element.css({marginTop: '-50px'});
        }
      }
    // up
    } else {
      console.log('scrolling up');
      if (this.lastScrollDirection !== 'up') {
        if (this.i >= 10) {
          this.i = 0;
          this.lastScrollDirection = 'up';
          console.log('%c body scroll up triggered', 'color: orange');
          // window.scrollTo(0, -10);
          this.$body.scrollTop(0);
          this.$element.css({marginTop: '0'});
        }
        this.i += 1;
      }
    }
    this.lastScrollTop = st;
  }
}

let scrollEmulation = new ScrollEmulation($('[data-emulate-scroll]'));

scrollEmulation.bindEvent();

// var lastScrollTop = 0;
// $('[data-emulate-scroll]').scroll(function(event) {
//   console.log('i was scrolled!');
//   var st = $(this).scrollTop();
//   // down
//   if (st > lastScrollTop) {
//     window.scrollTo(0, 100);
//   // up
//   } else {
//     window.scrollTo(0, -100);
//   }
//   lastScrollTop = st;
// });
}(jQuery);
