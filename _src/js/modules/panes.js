'use strict';

!function($) {

// IDEA The Basic Concept:
// -----------------------
// detect panes
// check if a pane is the main content pane
  // if pane is body content position it correctly and allow full scrolling.
  // this will also be push aside when another pane is active.
// all panes need to live either to the right or the left of the viewport

// need to deal with nested panes
  // should nested panes be folded in, and expanded once the parent pane is active?

// IDEA Loop through all panes in document (or element passed to the constructor), and
//      store them in an object. While doing this make a jQuery object out of each and
//      use the id of the element as the key and the jQuery object as the value. Then
//      when a change in state is triggered, the id of the open trigger will pass as the
//      key to access the jQuery object of the new active element.
// NOTE - Would this be slower or faster than just using `find()` or `children()` on the
//        element passed to the constructor?
//      - It comes down to which being faster. One jQuery object that has to continually
//        traverse nodes, or traversing it once on init and accessing from the registered
//        pane elements?
class Panes {

  get defaults() {
    return {
      dataAttr:           Gingabulous.modules.Panes.dataAttr,
      paneDataAttr:       'data-pane',
      translateXDistance: '100%';
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
  get mainPaneAttr() {
    return `${this.options.paneDataAttr}-main`;
  }
  get mainPaneTarget() {
    return `[${this.options.paneDataAttr}-main]`;
  }
  get paneTarget() {
    return `[${this.options.paneDataAttr}]`;
  }
  get panesTarget() {
    return `[${this.options.dataAttr}]`;
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
    this.debug = new Debug('Panes', true);
    this.scroll = new Gingabulous.ScrollPosition($(this.target.main));
    this.state = {
      active:   'main',
      previous: false
    };
    this.panes = {};
  }
  init() {
    this.registerMainPane();
    $(this.paneTarget).each((index, element) => this.registerPane(index, element));
    this.debug.values('init', {panes: this.panes});
    this.bindEventsToEachOpen();
    this.bindEventsToEachClose();
  }
  updateState(id) {
    if (this.state.active !== id) {
      this.state.previous = this.state.active;
      this.state.active = id;
      this.updatePositions();
    }
  }
  updatePositions() {
    let pane = this.panes[this.state.active];
    this.debug.values('updatePositions', {pane, main: this.panes.main});

    if (!Array.isArray(pane) && this.state.active !== 'main') {
      pane.css({transform: 'translateX(0)'});
      this.panes.main.css({transform: 'translateX(100%)'});
    }
    if (this.state.active === 'main') {
      pane.removeAttr('style');
      this.panes[this.state.previous].css({transform: 'translateX(-100%)'});
    }
  }
  registerMainPane() {
    this.panes.main = $(this.target.main);
  }
  registerPane(index, element) {
    let $pane = $(element);
    let key = $pane.attr(this.attr.pane);
    // if the data attr has no value, then it's a nested pane.
    if (key !== '') {
      let children = false;
      let hasChildren = $pane.children(this.target.parent).attr(this.attr.parent);
      // does this pane have children?
      if (hasChildren === undefined) {
        this.panes[key] = $pane;
      } else {
        children = [];
        // time to count the children.
        $pane.children(this.target.parent).children(this.target.pane).each(function() {
          // shove the child into the happy funtime playpen array.
          children.push($(this));
        });
        this.panes[key] = [$pane, children];
      }

      this.debug.values('registerPane', {$pane, key, hasChildren, children});
    }
  }
  translate(value, direction = 'x') {
    if (direction === 'x') {
      return `translateX(${value})`;
    }
    if (direction === 'y') {
      return `translateY(${value})`;
    }
    if (direction === 'z') {
      return `translateZ(${value})`;
    }
  }
  // ///////////////// //
  // Main Pane Methods //
  // ///////////////// //
  makeMainPaneInactive() {
    // Save the scroll position to restore it later.
    this.scroll.setLastPosition();

    // set fixed height & width and make overflow hidden.
    // QUESTION Do we need the 'pointer-events' property set to `none`?
    this.freezeMainPane();
  }
  unfreezeMainPane() {
    this.panel.main.css(freezeScrollStyles());
    // Restore scroll position before pane was made inactive.
    this.scroll.restoreLastPosition();
  }
  freezeMainPane() {
    let height = this.$window.height();
    let width = this.$window.width();
    this.panel.main.css({freezeScrollStyles(height, width, 'hidden'));
  }
  freezeScrollStyles(height = '', width = '', overflow = '') {
    return {height, width, overflow};
  }



  // /////////////////// //
  // Common Pane Methods //
  // /////////////////// //

  // //////////////////// //
  // Open Trigger Methods //
  // //////////////////// //

  // ///////////////////// //
  // Close Trigger Methods //
  // ///////////////////// //

  // /////////////////// //
  // Parent Pane Methods //
  // /////////////////// //

  bindEventsToEachOpen() {
    $(this.target.open).each((index, element) => this.bindOpenEvents(index, element));
  }
  bindEventsToEachClose() {
    $(this.target.close).each((index, element) => this.bindCloseEvents(index, element));
  }
  openEvents(id) {
    this.updateState(id);
    console.log(this.state);
  }
  closeEvents() {
    this.updateState('main');
    console.log(this.state);
  }
  bindOpenEvents(index, element) {
    let $element = $(element);
    let id = $element.attr(this.attr.open);

    this.debug.values('bindOpenEvents', {$element, id});
    $element.click(() => this.openEvents(id));
  }
  bindCloseEvents(index, element) {
    let $element = $(element);
    let id = $element.attr(this.attr.open);

    this.debug.values('bindOpenEvents', {$element, id});
    $element.click(() => this.closeEvents(id));
  }

}

Gingabulous.registerModule(Panes);

}(jQuery);
