!function() {

class Responsive {
  constructor(element) {
    this.valueString = element.getAttribute('data-responsive');
    this.breakpoints = Gingabulous.breakpoints;
    this.breakpointArray = Gingabulous.MediaQuery.breakpointArray;
  }

  get valuesArray() {
    if (this.valueString === undefined || this.valueString === null) {
      return [];
    }
    return this.valueString.split(' ');
  }

  get enabledQueries() {
    let output = [];
    if (this.valuesArray <= 0) {
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

  _isAKey(param) {
    for (var key in this.breakpoints) {
      if (param === key) {
        return true;
      }
    }
    return false;
  }
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
      for (var index in this.breakpointArray) {
        if (splitParam[1] === 'up' && this._indexOfQuery(splitParam[0]) <= index) {
          output.push(this.breakpointArray[index]);
        }
        if (splitParam[1] === 'down' && this._indexOfQuery(splitParam[0]) >= index) {
          output.push(this.breakpointArray[index]);
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
    for (var nIndex in newArray) {
      if ({}.hasOwnProperty.call(newArray, nIndex)) {
        isInOldArray = false;
        for (var oIndex in oldArray) {
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
  _indexOfQuery(query) {
    for (var index in this.breakpointArray) {
      if (this.breakpointArray[index] === query) {
        return index;
      }
    }
  }
  isActive() {
    let enabledQueries = this.queryValues;
    let currentQuery = Gingabulous.MediaQuery.currentMediaQuery();
    return enabledQueries[currentQuery];
  }
}
Gingabulous.Responsive = Responsive;

}();
