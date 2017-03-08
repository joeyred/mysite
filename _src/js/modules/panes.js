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
    this.$carousel.css({transform: ''});
    this.$titleBar.css({transform: ''});
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
        // .css(this.translate(origin))
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
  /**
   * This will assign grid positions for panes based on css classes.
   * @method getPaneOrigin
   *
   * @example
   * The panes grid, with [0, 0] being the viewport:
   *
   * | -1,-1 | 0,-1 | 1,-1 |
   * |-------|------|------|
   * | -1,0  | 0,0  | 1,0  |
   * |-------|------|------|
   * | -1,1  | 0,1  | 1,1  |
   *
   * @param  {jQuery}      $pane - The pane element to check.
   * @return {Array}             - The coordinates of the pane on the panes grid.
   */
  getPaneOrigin($pane) {
    if ($pane.hasClass(this.classes.right)) {
      return [1, 0];
    }
    if ($pane.hasClass(this.classes.above)) {
      return [0, -1];
    }
    if ($pane.hasClass(this.classes.below)) {
      return [0, 1];
    }
    return [-1, 0];
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
  // IDEA - maybe use the scrolling even to detect down scrolling and then check height
  //        value differences? Maybe update the margin-top value right then and there?
  //      - maybe the height and width of inactive panes, as well as any required margin
  //        properties to properly have stuff sit right in the DOM order, should be
  //        updated on these events as well?
  toActive(pane) {
    let $pane = pane.element;

    // Get correct css class
    let cssClass = this.getPositionClass(pane.getOrigin());
    if (!cssClass) {
      cssClass = this.getPositionClass(pane.position);
    }
    console.log('Active pane class:', cssClass);

    // NOTE: BEFORE TRANSITION STARTS
    // ------------------------------

    // Remove fixed class
    $pane.removeClass(this.classes.fixed);

    // Update the pane position value in its instance
    pane.setPosition([0, 0]);

    // unfreeze the pane
    $pane.removeClass(this.classes.frozen);

    // Remove flex-order class
    $pane.removeClass(`${cssClass}-order`);
    // Add active class FIXME
    $pane.addClass('active');

    // NOTE: BEGIN TRANSITION
    // ----------------------
    // Remove transform class
    $pane.removeClass(cssClass);

    // NOTE: AFTER TRANSITION IS OVER
    // ------------------------------
    this.transitionDelay(() => {
      console.log(pane.scrollPosition);

      // Add active class FIXME: see line: 262
      // $pane.addClass('active');

      // give the window the panes old scroll position.
      this.$window.scrollTop(pane.scrollPosition);
    });
  }
  toInactive(pane) {
    let coordinates = pane.getOrigin();
    console.log('coordinates before conditional:', coordinates);
    let cssClass = this.getPositionClass(coordinates);

    if (!cssClass) {
      coordinates = this.panes[this.state.active].getOrigin();
      pane.setPosition(coordinates);
      cssClass = this.getPositionClass(pane.position);
    } else {
      pane.setPosition(coordinates);
    }
    console.log('coordinates after conditional:', coordinates);
    console.log('Inactive pane class:', cssClass);
    let $pane = pane.element;



    // NOTE: BEFORE TRANSITION STARTS
    // ------------------------------

    // store current scroll position
    pane.scrollPosition = this.scroll.position;

    // Add freeze class
    $pane.addClass(this.classes.frozen);

    // Add fixed class
    $pane.addClass(this.classes.fixed);

    // set the scroll position of the element to the value from the window.
    $pane.scrollTop(pane.scrollPosition);

    // Update the pane's position data


    $pane.removeClass('active');
    $pane.addClass(`${cssClass}-order`);

    // NOTE: BEGIN TRANSITION
    // ----------------------
    // Add transform class
    $pane.addClass(cssClass);




    // NOTE: AFTER TRANSITION IS OVER
    // ------------------------------
    this.transitionDelay(() => {

      // if (this.state.previous === 'main') {
      //   let height = window.innerHeight;
      //   // $pane.css({marginTop: `-${height}px`});
      // }
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
  getPositionClass(coordinates) {
    let cssClass = [];
    if (coordinates[1] === -1) {
      cssClass.push('above');
    }
    if (coordinates[1] === 1) {
      cssClass.push('below');
    }
    if (coordinates[0] === -1) {
      cssClass.push('left');
    }
    if (coordinates[0] === 1) {
      cssClass.push('right');
    }
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      return false; // should this be an empty string?
    }
    return cssClass.join('-');
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
