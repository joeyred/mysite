'use strict';

!function() {

const extend = function(out) {
  out = out || {};

  for (let i = 1; i < arguments.length; i++) {
    if (!arguments[i]) {
      continue;
    }
    for (let key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        out[key] = arguments[i][key];
      }
    }
  }
  return out;
};

const deepExtend = function(out) {
  out = out || {};

  for (let i = 1; i < arguments.length; i++) {
    let obj = arguments[i];

    if (!obj) {
      continue;
    }
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          out[key] = deepExtend(out[key], obj[key]);
        } else {
          out[key] = obj[key];
        }
      }
    }
  }
  return out;
};

Gingabulous.extend = extend;
Gingabulous.deepExtend = deepExtend;
}();
