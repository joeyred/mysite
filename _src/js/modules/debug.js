/**
 * Controls whether debug functions have any output to console.
 * @type {Boolean}
 */
var GLOBAL_DEBUG_ENABLED = true;

/**
 * Debug constructor
 *
 * @constructor
 *
 * @param  {String}  objectName          - Name of the parent object of all logged data.
 * @param  {Boolean} [debugEnabled=true] - Local control of debug output.
 */
function Debug(objectName, debugEnabled) {
  this.objectName = objectName;
  if (debugEnabled === true) {
    this.debugEnabledForThis = true;
  } else {
    this.debugEnabledForThis = false;
  }
}

Debug.prototype = {
  constructor: Debug,

  /**
   * Checks both the global and local options for debug output to console.
   *
   * @method isDebugEnabled
   *
   * @return {Boolean}       - Whether enabled debug output is true or false.
   */
  isDebugEnabled: function() {
    var debug = false;
    if (GLOBAL_DEBUG_ENABLED && this.debugEnabledForThis) {
      debug = true;
    }
    // console.log(debug);
    return debug;
  },
  /**
   * Adds suffix to number passed.
   *
   * @method addSuffixToNumber
   *
   * @param  {number}          number - The number to have a suffix added to.
   *
   * @return {string}                 - Number with suffix added.
   */
  addSuffixToNumber: function(number) {
    // Get remainder of `i` divided by 10.
    var lastDigit = number % 10;
    // Get remainder of `i` divided by 100.
    var lastTwoDigits = number % 100;
    // If lastDigit is 1 but last two digits not 1, return with added "st".
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return number + 'st';
    }
    // If lastDigit is 2 but second to last digit is not 1, return with added "nd".
    if (lastDigit === 2 && lastTwoDigits !== 12) {
      return number + 'nd';
    }
    // If lastDigit is 2 but second to last digit is not 1, return with added "rd".
    if (lastDigit === 3 && lastTwoDigits !== 13) {
      return number + 'rd';
    }
    // For all other numbers, return with added "th".
    return number + 'th';
  },
  /**
   * Very simple function to handle outputting a values type in debug output.
   *
   * @method valueType
   *
   * @param  {String|Number|Boolean|Array|Object}  value - The value you wish to know the
   *                                                       type of.
   *
   * @return {String}                                    - The value's type.
   */
  valueType: function(value) {
    return typeof value;
  },
  outputValues: function(values) {
    for (var key in values) {
      if ({}.hasOwnProperty.call(values, key)) {
        // Log key and it's value in a readable fashion.
        console.log(key + ' is: ', values[key], ' (' + this.valueType(values[key]) + ')');
      }
    }
  },
  /**
   * Make the name of the parent object green in console output.
   *
   * @method outputObjectParent
   *
   */
  outputObjectParent: function() {
    console.log('%c ' + this.objectName, 'color: green');
  },
  /**
   * Check if function has been called and what it returned.
   *
   * @method functionReturn
   *
   * @param  {string}         functionName - Name of the function called.
   *
   * @param  {Boolean|String} output       - The return of the function, or false.
   */
  functionReturn: function(functionName, output) {
    // Check if debug mode is enabled.
    if (this.isDebugEnabled()) {
      this.outputObjectParent();
      // If the function has no return, then just say the function was called,
      if (output === 'undefined') {
        console.log(functionName + ' has been called. Function has no return');
      // Else, log out the function being called along with its return.
      } else {
        console.log(functionName + ' has been called. Returned: ' + output);
      }
    }
  },
  /**
   * Output values within a function to console.
   *
   * @example
   * // Will log to console:
   * //   Within foobar:
   * //   foo is: 5 (Number)
   * //   bar is: 22 (Number)
   * function foobar() {
   *   var foo = 5;
   *   var bar = 22;
   *   Debug.value('foobar',
   *     {foo: foo, bar: bar}
   *   );
   * }
   *
   * @method value
   *
   * @param  {String} functionName - Name of function the value reside in.
   * @param  {Object} values       - Object with keys matching variable names to be output
   *                                 to console.
   */
  values: function(functionName, values) {
    // Check if debug mode is enabled.
    if (this.isDebugEnabled()) {
      this.outputObjectParent();
      console.log('%c Within ' + functionName + ':', 'color: purple');
      // Loop through values within the function.
      this.outputValues(values);
      // for (var key in values) {
      //   if ({}.hasOwnProperty.call(values, key)) {
      //     // Log key and it's value in a readable fashion.
      //     console.log(key + ' is: ', values[key], ' (' + this.valueType(values[key]) + ')');
      //   }
      // }
    }
  },
  loop: function(functionName, i, values) {
    if (this.isDebugEnabled()) {
      console.log('%c Within ' + functionName + ':', 'color: purple');
      if (typeof i === 'number') {
        var currentIteration = this.addSuffixToNumber(i + 1);
        console.log(currentIteration + ' iteration of for loop:');
        this.outputValues(values);
      } else {
        console.log('current key in forin: ' + i);
        this.outputValues(values);
      }
    }
  }
};
