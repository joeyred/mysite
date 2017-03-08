// 'use strict';

!function($) {

var Gingabulous = {
  modules: {},

  // init: function() {
  //   for (var module in this.modules) {
  //     if ({}.hasOwnProperty.call(this.modules, module)) {
  //       $(module.dataAttr).each(this._initInstance(module));
  //     }
  //   }
  // },
  // _initInstance: function(module) {
  //   [module.name] = new this[module.name]();
  // },
  /**
   * Covert CamalCase to hyphenated string.
   * @method _hyphenate
   *
   * Found in Foundation for Sites core file. Link to that file, and the link they have
   * as the source for the solution.
   * @link https://github.com/zurb/foundation-sites/blob/develop/js/foundation.core.js
   * @link http://stackoverflow.com/a/8955580
   *
   * @param  {string}   string - String to parse and covert.
   * @return {string}          - hyphenated string.
   */
  _hyphenate: function(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  // _getDataAttr: function(dataAttrName) {
  //   return `data-${dataAttrName}`;
  // },
  registerModule: function(module, dataAttrName) {
    var name = module.prototype.constructor.name;
    // If no value for `dataAttrName` is passed, then assign `name` to the value.
    dataAttrName = dataAttrName || this._hyphenate(name);
    // Add the module to the `modules` object.
    this.modules[name] = {
      name:           name,
      dataAttr:       `data-${dataAttrName}`,
      dataAttrTarget: `[data-${dataAttrName}]`
    };
    this[name] = module;
  },
  /**
   * For big modules that have child modules specific to to them, this is how you register
   * a child module in the library. The child module will be attacthed to the parent if
   * the parent is registered as a module in the library. This is a bit of "Library in a
   * library."
   * @method registerChildModule
   * @param  {String}            parent - The name of the registered parent module.
   * @param  {Object}            child  - The child module to be registered.
   */
  registerChildModule: function(parent, child) {
    // Make sure the parent module exists.
    if (this[parent] !== undefined) {
      // Make sure the child module is infringing on another child's namespace.
      if (this[parent][child] !== undefined) {
        this[parent][child] = child;
      } else {
        throw new(Error(`Already a child module called ${child}`));
      }
    } else {
      throw new(Error(`${parent} module does not exist`));
    }
  }
};

Gingabulous.breakpoints = {
  sm:  0,
  md:  40,
  lg:  64,
  xl:  75,
  xxl: 90
};

window.Gingabulous = Gingabulous;
}(jQuery);
