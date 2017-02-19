'use strict';

var Gingabulous = {
  modules: {},

  // _getDataAttr: function(dataAttrName) {
  //   return `data-${dataAttrName}`;
  // },
  registerModule: function(name, dataAttrName) {
    // If no value for `dataAttrName` is passed, then assign `name` to the value.
    dataAttrName = dataAttrName || name;
    // Add the module to the `modules` object.
    this.modules[name] = {name: name, dataAttr: `data-${dataAttrName}`};
  }

};
