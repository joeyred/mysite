!function() {

class Responsive {
  /**
   * @constructor
   * @param  {Object}    element - JS API DOM Node
   */
  constructor(element) {
    this.element = element;
    this.valueString = element.getAttribute('data-responsive');
    this.breakpoints = Gingabulous.breakpoints;
    this.breakpointArray = Gingabulous.breakpointArray;
    this.windowWidth = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    // expose the responsive state of the element
    this._setState();
    this._onResize();
  }
  /**
   * Takes a string of breakpoints from the data attribute of the
   * element passed to the constructor and converts it into an array.
   * @method valuesArray
   * @return {Array}    - An array of breakpoints.
   */
  get valuesArray() {
    if (this.valueString === undefined || this.valueString === null) {
      return [];
    }
    return this.valueString.split(' ');
  }
  get enabledQueries() {
    let output = [];
    // If there are no breakpoints passed, then return the entire array of breeakpoints.
    if (this.valuesArray.length <= 0) {
      return this.breakpointArray;
    }
    for (let index in this.valuesArray) {
      if ({}.hasOwnProperty.call(this.valuesArray, index)) {
        let parsedValue = this._parseParam(this.valuesArray[index]);
        output = this._parseArray(output, parsedValue);
      }
    }
    return output;
  }
  get queryValues() {
    let output = {};
    for (let key in this.breakpoints) {
      if ({}.hasOwnProperty.call(this.breakpoints, key)) {
        output[key] = false;
        for (let query in this.enabledQueries) {
          if (key === this.enabledQueries[query]) {
            output[key] = true;
          }
        }
      }
    }
    return output;
  }
  /**
   * Checks if the passed key matches any of the breakpoint keys.
   * @method _isAKey
   * @param  {String}  keyToCheck - The key to check against the breakpoints.
   * @return {Boolean}            - If there is a match then true is returned, else false.
   */
  _isAKey(keyToCheck) {
    for (let key in this.breakpoints) {
      if (keyToCheck === key) {
        return true;
      }
    }
    return false;
  }
  /**
   * Parses a value containing a breakpoint and keyword.
   * @method _parseParam
   * @param  {String}    param - The individual param parsed from the string.
   * @return {Array}           - An array of breakpoints that represent when a module can
   *                             be active.
   */
  _parseParam(param) {
    var output = [];
    if (!this._isAKey(param)) {
      let splitParam = param.split('-');
      let query = splitParam[0];
      let keyword = splitParam[1];

      if (keyword === 'only') {
        output.push(query);
        return output;
      }
      /** Go through each active breakpoint */
      for (let index in this.breakpointArray) {
        if ({}.hasOwnProperty.call(this.breakpointArray, index)) {
          /** if the keyword is `up` then only push if the index of the query is less
              than or equal to the index of the loop */
          if (splitParam[1] === 'up' && this._indexOfQuery(splitParam[0]) <= index) {
            output.push(this.breakpointArray[index]);
          }
          /** if the keyword is `down` then only push if the index of the query is greater
              than or equal to the index of the loop */
          if (splitParam[1] === 'down' && this._indexOfQuery(splitParam[0]) >= index) {
            output.push(this.breakpointArray[index]);
          }
        }
      }
      return output;
    }
    output.push(param);
    return output;
  }
  _parseArray(oldArray, newArray) {
    let output = oldArray;
    let isInOldArray = false;
    for (let nIndex in newArray) {
      if ({}.hasOwnProperty.call(newArray, nIndex)) {
        isInOldArray = false;
        for (let oIndex in oldArray) {
          if (newArray[nIndex] === oldArray[oIndex]) {
            isInOldArray = true;
          }
        }
        if (!isInOldArray) {
          output.push(newArray[nIndex]);
        }
      }
    }
    return output;
  }
  /**
   * Gets the index of the current breakpoint being querried
   * @method _indexOfQuery
   * @param  {String}      query - The name of the breakpoint key
   * @return {Number}            - The index of that key in the breakpoint array.
   */
  _indexOfQuery(query) {
    for (let index in this.breakpointArray) {
      if (this.breakpointArray[index] === query) {
        return index;
      }
    }
  }
  _setState() {
    let state;
    if (this.queryValues[Gingabulous.activeBreakpoint()]) {
      state = 'active';
    } else {
      state = 'inactive';
    }
    this.element.setAttribute('data-responsive-state', state);
  }
  _onResize() {
    if (!Gingabulous.events.resize) {
      Gingabulous.registerGlobalEventListener('resize', window);
    }
    Gingabulous.events.resize.registerCallback(() => this._setState());
  }
  isActive() {
    // let enabledQueries = this.queryValues;
    // console.log(enabledQueries);
    // let currentQuery = Gingabulous.activeBreakpoint();
    // console.log(enabledQueries[currentQuery]);
    return this.queryValues[Gingabulous.activeBreakpoint()];
  }
  // Utility to wrap onResize actions in to avoid issues with window height resizing from
  // mobile browsers show/hiding UI elements.
  windowWidthWasResized() {
    let currentWindowWidth = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
    let output = false;

    if (currentWindowWidth !== this.windowWidth) {
      output = true;
    }
    this.windowWidth = currentWindowWidth;
    return output;
  }
}
Gingabulous.Responsive = Responsive;

}();
