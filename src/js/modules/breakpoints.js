!function() {
/**
 * Default breakpoint values in ems
 * @type {Object}
 */
Gingabulous.breakpoints = {
  sm:  0,
  md:  40,
  lg:  64,
  xl:  75,
  xxl: 90
};

/**
 * This allows for the overwriting of the default breakpoints. Call this in your main
 * app/index file, before you call any other function.
 * @method
 * @param  {Object} breakpoints - An object of keys that are the names of the breakpoint
 *                                and values that are the breakpoint in ems.
 */
Gingabulous.setBreakpoints = function(breakpoints) {
  Gingabulous.breakpoints = breakpoints;
};

/**
 * Converts pixel values to em values based on the `html` level `font-size`.
 * @method pixelsToEms
 * @param  {Number|String}    pixels - pixel value to be converted to ems.
 * @return {Number}                  - value in ems.
 */
function pixelsToEms(pixels) {
  let html = document.querySelector('html');
  return pixels / parseFloat(getComputedStyle(html)['font-size']);
}

/**
 * Returns the currently active breakpoint as a string. The value is the same as
 * the keys used in the breakpoints object.
 * @method activeBreakpoint
 * @return {String}         The name of the currently active breakpoint.
 */
function activeBreakpoint() {
  let windowWidth = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

  for (let key in Gingabulous.breakpoints) {
    if ({}.hasOwnProperty.call(Gingabulous.breakpoints, key)) {
      if (pixelsToEms(windowWidth) > Gingabulous.breakpoints) {
        continue;
      } else {
        return key;
      }
    }
  }
}

Gingabulous.activeBreakpoint = activeBreakpoint;
}();
