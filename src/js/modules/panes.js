!function() {

class Panes {
  /**
   * Creates a new insatnce of Panels
   * @class
   * @requires ScrollPosition
   * @requires Debug
   *
   * @param {jQuery} element - jQuery object that is the highest panes ansestor.
   * @param {Object} options - Can Override default ui module config.
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = Gingabulous.deepExtend({}, this.defaults, options);
    this.classes = this.options.classes;
    this.state = {
      active:   'home',
      previous: false
    };
    this.panes = {};
  }
  get defaults() {
    return {
      dataAttr:          Gingabulous.modules.Panes.dataAttr,
      paneDataAttr:      'data-pane',
      translateDistance: 100,
      classes:           {
        panes:  'panes',
        pane:   'pane',
        frozen: 'frozen-pane',
        fixed:  'fixed-pane',
        active: 'active',
        left:   'left',
        right:  'right',
        above:  'above',
        below:  'below'
      }
    };
  }
  get attr() {
    return {
      parent: this.options.dataAttr,
      main:   `${this.options.paneDataAttr}-home`,
      pane:   this.options.paneDataAttr,
      open:   `${this.options.paneDataAttr}-open`,
      close:  `${this.options.paneDataAttr}-close`
    };
  }
  get target() {
    return {
      parent: `[${this.options.dataAttr}]`,
      main:   `[${this.options.paneDataAttr}-home]`,
      pane:   `[${this.options.paneDataAttr}]`,
      open:   `[${this.options.paneDataAttr}-open]`,
      close:  `[${this.options.paneDataAttr}-close]`
    };
  }
  init() {
    this._registerPanes();
    this._events();
  }
  _updateState(id) {
    if (this.state.active !== id) {
      this.state.previous = this.state.active;
      this.state.active = id;
      this._updatePositions();
      // console.log(this.state, this.panes);
    }
  }
  _updatePositions() {
    // NOTE YOU MUST RUN THE DEACTIVATE METHOD BEFORE THE ACTIVATE METHOD.
    //      Failing to do so will result in the scroll position not being stored.
    if (this.state.previous === 'home') {
      this.panes[this.state.previous].deactivate(this.panes[this.state.active].retriveOrigin());
    } else {
      this.panes[this.state.previous].deactivate();
    }
    this.panes[this.state.active].activate();
  }
  _registerPanes() {
    let panesInDocument = this.element.querySelectorAll(this.target.pane);
    for (let i = 0; i < panesInDocument.length; i++) {
      let key = panesInDocument[i].getAttribute(this.attr.pane);

      // if the data attr has no value, then it's a nested pane, and will be skipped
      if (key !== '' && key !== 'home') {
        if (!!panesInDocument[i].querySelector('[data-carousel-panes]')) {
          this.panes[key] = new Gingabulous.CarouselPane(
            panesInDocument[i],
            this.options
          );
        } else {
          this.panes[key] = new Gingabulous.Pane(panesInDocument[i], this.options);
        }
      }
      if (key === 'home') {
        this.panes[key] = new Gingabulous.HomePane(panesInDocument[i], this.options);
      }
    }
  }
  _events() {
    this.element.addEventListener('click', (event) => {
      // Open Events Triggered
      if (event.target.hasAttribute(this.attr.open)) {
        let id = event.target.getAttribute(this.attr.open);
        this._updateState(id);
        if (event.target.hasAttribute('data-inject')) {
          // Inject logic here
          let key = event.target.getAttribute('data-inject');
          this.panes[id].inject.updateContent(key);
        }
      }
      if (event.target.hasAttribute(this.attr.close)) {
        // console.log('fired closing event');
        this._updateState('home');
      }
    });
  }
}

Gingabulous.registerModule(Panes);

}();
