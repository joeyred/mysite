!function($) {

class Pane {

  constructor(element, position, children, isMain = false) {
    this.element        = element;
    this.origin         = position;
    this.position       = position;
    this.children       = children;
    this.isMain         = isMain;
    this.scrollPosition = 0;
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
    this.$carousel.css({transform: `translateX(-100%)`});
    this.$titleBar.css({transform: `translateX(-100%)`});
  }
  goToRight() {
    this.$carousel.css({transform: `translateX(-200%)`});
    this.$titleBar.css({transform: `translateX(-200%)`});
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
        panes:  'panes',
        pane:   'pane',
        frozen: 'frozen-pane',
        fixed:  'fixed-pane',
        right:  'right',
        above:  'above',
        below:  'below'
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
    this.$body = $('body');
    this.options = $.extend(true, this.defaults, options);
    this.classes = this.options.classes;
    this.debug = new Debug('Panes', true);
    this.scroll = new Gingabulous.ScrollPosition(this.$window);
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

  // ///////////////// //
  // Pane Registration //
  // ///////////////// //

  registerMainPane() {
    this.panes.main = new Pane($(this.target.main), [0, 0], false, true);
  }
  registerPane(index, element) {
    let $pane = $(element);
    let key = $pane.attr(this.attr.pane);
    let children = []
    // if the data attr has no value, then it's a nested pane, and will be skipped.
    if (key !== '') {
      // let height = this.$window.height();
      // let width = this.$window.width();
      let origin = this.getPaneOrigin($pane);
      $pane
        .css(this.translate(origin))
        .addClass(this.classes.frozen)
        .addClass(this.classes.fixed);
      // $pane.css(this.setScrollStyles(height, width, 'hidden', 'fixed'));
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
  // ////////////// //
  // State Updating //
  // ////////////// //
  updateState(id) {
    if (this.state.active !== id) {
      this.state.previous = this.state.active;
      this.state.active = id;
      this.updatePositions(id, this.state.previous);
      this.debug.values('updateState', {panes: this.panes});
    }
  }

  // //////////////////// //
  // Update Pane Postions //
  // //////////////////// //

  updatePositions(active, previous) {
    this.toInactive(this.panes[previous]);
    this.toActive(this.panes[active]);
    // this.moveDeactivatedPaneOutOfViewport();
    // this.moveActivatedPaneInToViewport();
  }
  toActive(pane) {
    let $pane = pane.element;
    // IDEA - maybe use the scrolling even to detect down scrolling and then check height
    //        value differences? Maybe update the margin-top value right then and there?
    //      - maybe the height and width of inactive panes, as well as any required margin
    //        properties to properly have stuff sit right in the DOM order, should be
    //        updated on these events as well?
    // move into viewport
    $pane.css(this.translate([0, 0]));
    // After the move
    this.transitionDelay(() => {
      // unfreeze and unfix the pane
      $pane.removeClass(this.classes.frozen);
      // if its not restoring correctly, might need to get it to the top first.

      // give the window the panes old scroll position.
      console.log(pane.scrollPosition);
      $pane.removeClass(this.classes.fixed);
      if (this.state.active === 'main') {
        $pane.css({marginTop: ''});
      }
      this.$window.scrollTop(pane.scrollPosition);

    });
  }
  toInactive(pane) {
    let coordinates = pane.getOrigin();
    let $pane = pane.element;
    // If it's the main pane, then it has some stuff to do.
    if (this.state.previous === 'main') {
      coordinates = this.panes[this.state.active].getOrigin();
      console.log('%c coordinates reversed', 'color: red');
    }
    // store current scroll position
    pane.scrollPosition = this.scroll.position;
    // set fixed height & width, and set overflow to hidden
    // NOTE Leaving position out until after trasnition.
    // $pane.css({height: $pane.height(), width: $pane.width(), overflow: 'hidden'});
    $pane.addClass(this.classes.frozen);
    // $pane.addClass(this.classes.fixed);
    // set the scroll position on the element so it doesnt jump to the top.
    $pane.scrollTop(pane.scrollPosition);
    // Update the pane's position data
    pane.setPosition(coordinates);
    // Move the pane (applying transform)
    // IDEA This should probably move to a css class based approach in the future.
    $pane.css(this.translate(coordinates));
    this.transitionDelay(() => {
      $pane.addClass(this.classes.fixed);
      if (this.state.previous === 'main') {
        // let height = this.panes[this.state.active].element.height();
        // let height = this.$window.height() + 70;
        let height = window.innerHeight;
        $pane.css({marginTop: `-${height}px`});
      }
    });
  }

  transitionDelay(cb) {
    setTimeout(() => cb(), 300);
  }

  // /////////////////// //
  // Helpers / Utilities //
  // /////////////////// //

  setScrollStyles(height = '', width = '', overflow = '', position = '') {
    return {height: height, width: width, overflow: overflow, position: position};
  }

  translate(coordinates) {
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      // console.log('0, 0 was passed');
      return {transform: ''};
    }

    return {transform: `translate(${coordinates[0]}%, ${coordinates[1]}%)`};
  }

  // ////////////// //
  // Event Handling //
  // ////////////// //

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
