!function($) {

class MediaQuery {
  get windowInEms() {
    return this.$window.width() / parseFloat($('html').css('font-size'));
  }
  get breakpointArray() {
    var breakpointArray = [];
    for (var key in this.breakpoints) {
      if ({}.hasOwnProperty.call(this.breakpoints, key)) {
        breakpointArray.push(key);
      }
    }
    return breakpointArray;
  }
  constructor(breakpoints) {
    this.breakpoints = breakpoints;
    this.$window = $(window);
  }
  /**
   * @function
   * Get the current active media query.
   * @method currentMediaQuery
   *
   * @return {string} - Name of the currently active media query.
   */
  currentMediaQuery() {
    for (var key in this.breakpoints) {
      if ({}.hasOwnProperty.call(this.breakpoints, key)) {
        if (this.windowInEms > this.breakpoints[key]) {
          continue;
        } else {
          return key;
        }
      }
    }
  }
}

// Gingabulous.MediaQuery = new MediaQuery(Gingabulous.breakpoints);

}(jQuery);
