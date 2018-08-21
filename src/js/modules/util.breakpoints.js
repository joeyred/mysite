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

function breakpointArray(breakpoints) {
  let breakpointArray = [];
  for (let key in breakpoints) {
    if ({}.hasOwnProperty.call(breakpoints, key)) {
      breakpointArray.push(key);
    }
  }
  return breakpointArray;
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
  let windowWidthInEms = pixelsToEms(windowWidth);
  // console.log(windowWidth, windowWidthInEms);

  let previousKey;
  let i = 0;
  for (let key in Gingabulous.breakpoints) {
    if ({}.hasOwnProperty.call(Gingabulous.breakpoints, key)) {
      // This fixes the bug where the final breakpoint isnt honored.
      i++;
      // console.log(i);
      if (Gingabulous.breakpointArray.length === i) {
        // console.log(key);
        return key;
      }
      if (windowWidthInEms > Gingabulous.breakpoints[key]) {
        // console.log('loop continued');
        previousKey = key;
        continue;
      } else {
        // console.log(previousKey);
        // Reset index of loop.
        return previousKey;
      }
    }
  }
}

Gingabulous.activeBreakpoint = activeBreakpoint;
Gingabulous.breakpointArray = breakpointArray(Gingabulous.breakpoints);
}();
