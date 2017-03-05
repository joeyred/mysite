'use strict';

!function($) {

class Pane {

  constructor(element, position, children, isMain = false) {
    // const origin = position;
    // function exposeOrigin() {
    //   return origin;
    // }
    this.element = element;
    this.origin = position;
    this.position = position;
    this.children = children;
    this.isMain = isMain;
    // this.whatsTheOrigin = exposeOrigin();
  }
  getOrigin() {
    return Array.from(this.origin);
  }
  setPosition(coordinates) {
    if (this.isMain) {
      this.position = this._oppositeCoordinantes(coordinates);
    } else {
      this.position = coordinates;
    }
  }
  _oppositeCoordinantes(coordinates) {
    let _output2 = coordinates;
    for (let i = 0; i < _output2.length; i++) {
      if (_output2[i] === 0) {
        continue;
      }
      _output2[i] *= -1;

      // this.debug.loop('oppositeCoordinantes', i, {coordinate: coordinates[i]});
    }
    console.log(_output2);
    return _output2;
  }
}

class CarouselPanes {

  constructor(element, dataAttr) {
    this.$element = element;
    this.dataAttr = dataAttr;
    this.$carousel = element.children(`[${dataAttr}]`);

    console.log(element, dataAttr, this.$carousel);
  }
  button(id) {
    console.log(`[${this.dataAttr}-nav="${id}"]`);
    return this.$element.find(`[${this.dataAttr}-nav="${id}"]`);
  }
  goToLeft() {
    this.$carousel.css({transform: `translateX(0)`});
  }
  goToCenter() {
    this.$carousel.css({transform: `translateX(-100%)`});
  }
  goToRight() {
    this.$carousel.css({transform: `translateX(-200%)`});
  }
  bindEvents() {
    console.log('bind stuff', this.button('left'), this.button('center'), this.button('right'));
    this.button('left').click(() => this.goToLeft());
    this.button('center').click(() => this.goToCenter());
    this.button('right').click(() => this.goToRight());
  }
}

// translate(x, y)

class Panes {

  get defaults() {
    return {
      dataAttr:          Gingabulous.modules.Panes.dataAttr,
      paneDataAttr:      'data-pane',
      translateDistance: 100,
      classes:           {
        panes: 'panes',
        pane:  'pane',
        right: 'right',
        above: 'above',
        below: 'below'
      }
    };
  }
  get attr() {
    return {
      parent: this.options.dataAttr,
      main:   `${this.options.paneDataAttr}-main`,
      pane:   this.options.paneDataAttr,
      open:   `${this.options.paneDataAttr}-open`,
      close:  `${this.options.paneDataAttr}-close`
    };
  }
  get target() {
    return {
      parent: `[${this.options.dataAttr}]`,
      main:   `[${this.options.paneDataAttr}-main]`,
      pane:   `[${this.options.paneDataAttr}]`,
      open:   `[${this.options.paneDataAttr}-open]`,
      close:  `[${this.options.paneDataAttr}-close]`
    };
  }
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
    this.$element = element;
    this.$window = $(window);
    this.options = $.extend(true, this.defaults, options);
    this.classes = this.options.classes;
    this.debug = new Debug('Panes', true);
    this.scroll = new Gingabulous.ScrollPosition($(this.target.main));
    this.state = {
      active:   'main',
      previous: false
    };
    this.panes = {};
  }
  init() {
    // Register the Main Pane
    this.registerMainPane();
    // Now register the rest
    $(this.target.pane).each((index, element) => this.registerPane(index, element));

    // bind events
    this.bindEventsToEachTrigger();
    this.debug.values('init', {panes: this.panes});
  }
  registerMainPane() {
    this.panes.main = new Pane($(this.target.main), [0, 0], false, true);
  }
  registerPane(index, element) {
    let $pane = $(element);
    let key = $pane.attr(this.attr.pane);
    let children = [];
    // if the data attr has no value, then it's a nested pane, and will be skipped.
    if (key !== '') {
      let origin = this.getPaneOrigin($pane);
      $pane.css(this.translate(origin));
      if (this.hasChildren($pane)) {
        $pane.children(this.target.parent).children(this.target.pane).each(function() {
          // shove the child into the happy funtime playpen array.
          children.push($(this));
        });
        let carousel = new CarouselPanes($pane, this.attr.parent);
        carousel.bindEvents();
      } else {
        children = false;
      }
      this.panes[key] = new Pane($pane, origin, children);
    }
    // this.debug.values('registerPane', {$pane, key, children});
  }
  hasChildren($pane) {
    return $pane.children(this.target.parent).attr(this.attr.parent) !== undefined;
  }
  getPaneOrigin($pane) {
    if ($pane.hasClass(this.classes.right)) {
      return [100, 0];
    }
    if ($pane.hasClass(this.classes.above)) {
      return [0, -100];
    }
    if ($pane.hasClass(this.classes.below)) {
      return [0, 100];
    }
    return [-100, 0];
  }

  updateState(id) {
    if (this.state.active !== id) {
      this.state.previous = this.state.active;
      this.state.active = id;
      this.updatePositions();
      this.debug.values('updateState', {panes: this.panes});
    }
  }
  updatePositions() {
    this.moveDeactivatedPaneOutOfViewport();
    this.moveActivatedPaneInToViewport();
  }
  moveDeactivatedPaneOutOfViewport() {
    // Where to move to off screen
    let coordinates = this.panes[this.state.previous].getOrigin();

    if (this.state.previous === 'main') {
      coordinates = this.panes[this.state.active].getOrigin();
      console.log('%c coordinates reversed', 'color: red');
      // Freeze the main pane
      this.scroll.setLastPosition();
      setTimeout(() => this.freezeMainPane(), 300);
    }
    this.panes[this.state.previous].setPosition(coordinates);
    this.panes[this.state.previous].element.css(this.translate(coordinates));
    // if (this.state.previous === 'main') {
    //   this.freezeMainPane();
    // }
  }
  moveActivatedPaneInToViewport() {
    let coordinates = [0, 0];
    if (this.state.active === 'main') {
      this.unfreezeMainPane();
      this.scroll.restoreLastPosition();
    }
    this.panes[this.state.active].setPosition(coordinates);
    this.panes[this.state.active].element.css(this.translate(coordinates));
  }

  // ///////////////// //
  // Main Pane Methods //
  // ///////////////// //
  unfreezeMainPane() {
    this.panes.main.element.css(this.freezeScrollStyles());
    // Restore scroll position before pane was made inactive.
    this.scroll.restoreLastPosition();
  }
  freezeMainPane() {
    let height = this.$window.height();
    let width = this.$window.width();
    this.panes.main.element.css(this.freezeScrollStyles(height, width, 'hidden', 'fixed'));
  }
  freezeScrollStyles(height = '', width = '', overflow = '', position = '') {
    return {height: height, width: width, overflow: overflow, position: position};
  }

  translate(coordinates) {
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      // console.log('0, 0 was passed');
      return {transform: ''};
    }

    return {transform: `translate(${coordinates[0]}%, ${coordinates[1]}%)`};
  }

  bindEventsToEachTrigger() {
    $(this.target.open).each((index, element) => this.bindOpenEvents(index, element));
    $(this.target.close).each((index, element) => this.bindCloseEvents(index, element));
  }
  openEvents(id) {
    this.updateState(id);
    console.log('open event triggered');
    // console.log(this.state);
  }
  closeEvents() {
    this.updateState('main');
    console.log('close event triggered');
    // console.log(this.state);
  }
  bindOpenEvents(index, element) {
    let $element = $(element);
    let id = $element.attr(this.attr.open);

    // this.debug.values('bindOpenEvents', {$element, id});
    $element.click(() => this.openEvents(id));
  }
  bindCloseEvents(index, element) {
    let $element = $(element);
    // let id = $element.attr(this.attr.open);

    // this.debug.values('bindOpenEvents', {$element, id});
    $element.click(() => this.closeEvents());
  }
}

Gingabulous.registerModule(Panes);

}(jQuery);
