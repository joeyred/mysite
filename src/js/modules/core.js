// 'use strict';

!function() {
var Gingabulous = {
  modules: {},

  // init: function() {
  //   for (let module in this.modules) {
  //     if ({}.hasOwnProperty.call(this.modules, module)) {
  //       if (module)
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
  registerModule: function(module, jquery = false, dataAttrName) {
    var name = module.prototype.constructor.name;
    // If no value for `dataAttrName` is passed, then assign `name` to the value.
    dataAttrName = dataAttrName || this._hyphenate(name);
    // Add the module to the `modules` object.
    this.modules[name] = {
      name:           name,
      dataAttr:       `data-${dataAttrName}`,
      dataAttrTarget: `[data-${dataAttrName}]`,
      jquery:         jquery
    };
    this[name] = module;
  }
  // TODO Turn this into a registration of a namespace for a group of modules.
  // registerNamespacedModule: function(parent, child) {
  //   // let parentName = parent.prototype.constructor.name;
  //   let childName = child.prototype.constructor.name;
  //
  //   // Make sure the parent module exists.
  //   if (this[parent] !== undefined) {
  //     // Make sure the child module isn't infringing on another child's namespace.
  //     if (this[parent][childName] === undefined) {
  //       this[parent][childName] = child;
  //     } else {
  //       throw new Error(`Already a child module called ${childName}`);
  //     }
  //   } else {
  //     throw new Error(`${parent} module does not exist`);
  //   }
  // }
};

// Gingabulous.registerGlobalEventListener('scroll', window);

window.Gingabulous = Gingabulous;
}();
