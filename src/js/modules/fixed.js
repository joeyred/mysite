!function() {

class Fixed {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
  }
  get defaults() {
    return {
      dataAttr: Gingabulous.modules.Fixed.dataAttr
    };
  }
  init() {

  }
  _fixElement()
  _events() {
    if (!Gingabulous.events.resize) {
      Gingabulous.registerGlobalEventListener('resize', window);
    }
    Gingabulous.events.resize.registerCallback(() => )
  }
}
}();
