!function($) {

class CarouselPanes {

  constructor(element, dataAttr) {
    this.$element = element;
    this.dataAttr = dataAttr;
    this.$carousel = element.children(`[${dataAttr}]`);
    this.$titleBar = element.find('.pane-carousel-title-bar');

    console.log(element, dataAttr, this.$carousel);
  }
  button(id) {
    console.log(`[${this.dataAttr}-nav="${id}"]`);
    return this.$element.find(`[${this.dataAttr}-nav="${id}"]`);
  }
  goToLeft() {
    this.$carousel.css({transform: `translateX(0)`});
    this.$titleBar.css({transform: `translateX(0)`});
  }
  goToCenter() {
    this.$carousel.css({transform: ''});
    this.$titleBar.css({transform: ''});
  }
  goToRight() {
    this.$carousel.css({transform: `translateX(-200%)`});
    this.$titleBar.css({transform: `translateX(-200%)`});
  }
  bindEvents() {
    console.log(
      'bind stuff',
      this.button('left'),
      this.button('center'),
      this.button('right')
    );
    this.button('left').click(() => this.goToLeft());
    this.button('center').click(() => this.goToCenter());
    this.button('right').click(() => this.goToRight());
  }
}

// translate(x, y)

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
    }
  }
  _updatePositions() {
    this.panes[this.state.active].activate();
    this.panes[this.state.previous].deactivate();
  }
  _registerPanes() {
    let panesInDocument = this.element.querySelectorAll(this.target.pane);
    for (let i = 0; i < panesInDocument.length; i++) {
      let key = panesInDocument[i].getAttribute(this.attr.pane);
      // if the data attr has no value, then it's a nested pane, and will be skipped
      if (key !== '' && key !== 'home') {
        this.panes[key] = new Gingabulous.Pane(panesInDocument[i], this.options);
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
      }
      if (event.target.hasAttribute(this.attr.close)) {
        this._updateState('home');
      }
    });
  }
}

Gingabulous.registerModule(Panes);

}(jQuery);
