!function($) {

class Responsive {
  get valuesArray() {
    return this.valueString.split(' ');
  }
  // Make this return an array of enabled keys
  get enabledQueries() {
    let output = [];
    for (var index in this.valuesArray) {
      if ({}.hasOwnProperty.call(this.valuesArray, index)) {
        let parsedValue = this.parseParam(this.valuesArray[index]);
        output = this.parseArray(output, parsedValue);
      }
    }
    return output;
  }
  get queryValues() {
    let output = {};
    for (var key in this.breakpoints) {
      if ({}.hasOwnProperty.call(this.breakpoints, key)) {
        output[key] = false;
        for (var query in this.enabledQueries) {
          if (key === this.enabledQueries[query]) {
            output[key] = true;
          }
        }
      }
    }
    return output;
  }
  constructor(element) {
    this.$element = element;
    this.valueString = element.attr('data-responsive');
    this.breakpoints = Gingabulous.breakpoints;
    this.breakpointArray = Gingabulous.MediaQuery.breakpointArray;
    this.debug = new Debug('Responsive', true);
  }
  isAKey(param) {
    for (var key in this.breakpoints) {
      if (param === key) {
        return true;
      }
    }
    return false;
  }
  parseParam(param) {
    var output = [];
    if (!this.isAKey(param)) {
      let splitParam = param.split('-');
      let query = splitParam[0];
      let keyword = splitParam[1];

      if (keyword === 'only') {
        output.push(query);
        return output;
      }
      for (var index in this.breakpointArray) {
        if (splitParam[1] === 'up' && this.indexOfQuery(splitParam[0]) <= index) {
          output.push(this.breakpointArray[index]);
        }
        if (splitParam[1] === 'down' && this.indexOfQuery(splitParam[0]) >= index) {
          output.push(this.breakpointArray[index]);
        }
      }
      return output;
    }
    output.push(param);
    return output;
  }
  parseArray(oldArray, newArray) {
    let output = oldArray;
    let isInOldArray = false;
    for (var nIndex in newArray) {
      if ({}.hasOwnProperty.call(newArray, nIndex)) {
        isInOldArray = false;
        for (var oIndex in oldArray) {
          if (newArray[nIndex] === oldArray[oIndex]) {
            isInOldArray = true;
          }
          // this.debug.loop('parseArray', oIndex, {isInOldArray});
        }
        if (!isInOldArray) {
          output.push(newArray[nIndex]);
        }
      }
      // this.debug.loop('parseArray', nIndex, {output, isInOldArray});
    }
    return output;
  }
  indexOfQuery(query) {
    for (var index in this.breakpointArray) {
      if (this.breakpointArray[index] === query) {
        return index;
      }
    }
  }
  isEnabledForCurrentQuery() {

  }
}
Gingabulous.Responsive = Responsive;
// parse the value.
// take the first part and make that determine the key for the breakpoints object

// sm-only
// md-up
// md-down
// md-only
// etc...

}(jQuery);
