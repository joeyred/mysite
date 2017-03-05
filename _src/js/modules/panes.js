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
  // _oppositeCoordinantes(coordinates) {
  //   let _output2 = Array.from(coordinates);
  //   for (let i = 0; i < _output2.length; i++) {
  //     if (_output2[i] === 0) {
  //       continue;
  //     }
  //     _output2[i] *= -1;
  //
  //     // this.debug.loop('oppositeCoordinantes', i, {coordinate: coordinates[i]});
  //   }
  //   console.log(_output2);
  //   return _output2;
  // }
}

// translate(x, y)

// IDEA The Basic Concept:
// -----------------------
// detect panes
// check if a pane is the main content pane
  // if pane is body content position it correctly and allow full scrolling.
  // this will also be push aside when another pane is active.
// all panes need to live either to the right or the left of the viewport

// need to deal with nested panes
  // should nested panes be folded in, and expanded once the parent pane is active?

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

    // for (let pane in this.panes) {
    //   if ({}.hasOwnProperty.call(this.panes, pane)) {
    //     this.panes[pane].element.css(this.translate(this.panes[pane].origin));
    //     // this.debug.loop('init', pane, {
    //     //   element: this.panes[pane].element,
    //     //   origin:  this.panes[pane].origin
    //     // });
    //   }
    // }
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
      // coordinates = this.oppositeCoordinantes(toReverse);
    }
    this.panes[this.state.previous].setPosition(coordinates);
    this.panes[this.state.previous].element.css(this.translate(coordinates));
  }
  moveActivatedPaneInToViewport() {
    let coordinates = [0, 0];
    this.panes[this.state.active].setPosition(coordinates);
    this.panes[this.state.active].element.css(this.translate(coordinates));
  }
  // oppositeCoordinantes(coordinates) {
  //   for (let i = 0; i < coordinates.length; i++) {
  //     if (coordinates[i] === 0) {
  //       continue;
  //     }
  //     coordinates[i] *= -1;
  //
  //     // this.debug.loop('oppositeCoordinantes', i, {coordinate: coordinates[i]});
  //   }
  //   return coordinates;
  // }
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
    let id = $element.attr(this.attr.open);

    // this.debug.values('bindOpenEvents', {$element, id});
    $element.click(() => this.closeEvents(id));
  }
}

// IDEA Maybe panes can handle themselves a bit? know where they are?
//      and be able to tell the Panes class where they are when asked?
// function Pane(element, position = [], children = [], isMain = false) {
//   const origin = position;
//   this.getOrigin = function() {
//     return origin;
//   };
//   this.element = element;
//   // Object.defineProperty(this, 'origin', {
//   //   value:    position,
//   //   writable: false
//   // });
//   // this.whatsTheOrigin = this.getOrigin();
//   this.position = position;
//   this.children = children;
//   this.isMain = isMain;
// }
// Pane.prototype = {
//   constructor: Pane,
//   getOrigin:   function() {
//     const _output1 = this.origin;
//     return _output1;
//   },
//   setPosition: function(coordinates) {
//     if (this.isMain) {
//       this.position = this._oppositeCoordinantes(coordinates);
//     } else {
//       this.position = coordinates;
//     }
//   },
//   _oppositeCoordinantes(coordinates) {
//     const _output2 = coordinates;
//     for (let i = 0; i < _output2.length; i++) {
//       if (_output2[i] === 0) {
//         continue;
//       }
//       _output2[i] *= -1;
//
//       // this.debug.loop('oppositeCoordinantes', i, {coordinate: coordinates[i]});
//     }
//     return _output2;
//   }
// };

Gingabulous.registerModule(Panes);

}(jQuery);
