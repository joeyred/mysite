'use strict';
!function() {
/**
 * Pane Module
 * @module pane
 */
class Pane {
  /**
   * Creates a new insatnce of a pane.
   * @class
   * @fires Pane#_init
   * @param  {Object}    element          - the pane DOM node.
   * @param  {Object}    inheritedOptions - Parsed options from parent module.
   */
  constructor(element, inheritedOptions) {
    this.element        = element;
    this.origin         = this._getOrigin();
    this.position       = this.origin;
    this.classes        = inheritedOptions.classes;
    this.scrollPosition = 0;
    this._init();
  }

  get originClass() {
    return this._getPositionClass(this.retriveOrigin());
  }
  /**
   * Initializes the pane by adding the proper classes for an inactive pane.
   * @method _init
   * @private
   */
  _init() {
    this.element.classList.add(this.classes.frozen, this.classes.fixed);
    this.element.classList.add(this._getOrderClass(this.originClass));
  }
  /**
   * Returns the coordinates of the pane's origin based on it's class on document load.
   * @method getOrigin
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
   * @return {Array} The x and y coordinates on the grid.
   */
  _getOrigin() {
    if (this.element.classList.contains('right')) {
      return [1, 0];
    }
    if (this.element.classList.contains('above')) {
      return [0, -1];
    }
    if (this.element.classList.contains('below')) {
      return [0, 1];
    }
    return [-1, 0];
  }
  /**
   * Gets the proper css class based on the pane's coordinates.
   * @method _getPositionClass
   * @param  {Array}          coordinates - The coordinates of the pane.
   * @return {String|Boolean}             - The css class, or false if [0, 0] is passed.
   */
  _getPositionClass(coordinates) {
    let cssClass = [];
    if (coordinates[1] === -1) {
      cssClass.push(this.classes.above);
    }
    if (coordinates[1] === 1) {
      cssClass.push(this.classes.below);
    }
    if (coordinates[0] === -1) {
      cssClass.push(this.classes.left);
    }
    if (coordinates[0] === 1) {
      cssClass.push(this.classes.right);
    }
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      return false; // should this be an empty string?
    }
    if (cssClass.length >= 2) {
      return cssClass.join('-');
    }
    return cssClass.toString();
  }
  _getOrderClass(positionClass) {
    if (positionClass) {
      return `${positionClass}-order`;
    }
    return `${this.originClass}-order`;
  }
  _storeScrollPosition() {
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    console.log('stored:', this.scrollPosition);
  }
  _restoreScrollPosition(element) {
    if (element === window) {
      element.scrollTo(0, this.scrollPosition);
    } else {
      element.scrollTop = this.scrollPosition;
      // console.log('restore:', this.scrollPosition);
    }
  }
  _setWindowScrollPosition() {
    document.documentElement.scrollTop = this.scrollPosition;
    document.body.scrollTop = this.scrollPosition;
  }
  _setScrollPositionWhenFixed() {
    this.element.scrollTop = this.scrollPosition;
  }
  /**
   * Brings the pane into an active state.
   * @method activate
   *
   * @fires Panes#_setScrollPosition
   */
  activate() {
    // Update the position of the pane
    this.position = [0, 0];
    // let cssClass = this._getPositionClass(this.position);
    // Unfreeze pane
    this.element.classList.remove(this.classes.frozen, this.classes.fixed);
    // Remove flex order class
    this.element.classList.remove(this._getOrderClass(this.originClass));
    // Add active class
    this.element.classList.add(this.classes.active);
    // Restore scroll position
    // this._restoreScrollPosition(this.element);
    // if ()
    this._setWindowScrollPosition();
    // Remove transform class to begin transition
    this.element.classList.remove(this.originClass);
    // setTimeout(() => {
    //   this._restoreScrollPosition(window);
    // }, 300);
  }
  /**
   * Brings the pane into an inactive state
   * @method deactivate
   */
  deactivate() {
    this._storeScrollPosition();
    // Update the position of the pane
    this.position = this.origin;
    // console.log(this.retriveOrigin());
    // let cssClass = this._getPositionClass(this.position);
    // Take care of most of the classes
    this.element.classList.add(
      this.classes.frozen,
      this.classes.fixed,
      this._getOrderClass(this.originClass)
    );
    this.element.classList.remove(this.classes.active);
    // Take care of scroll position
    this._setScrollPositionWhenFixed();
    // Add the transform class to begin transition
    this.element.classList.add(this.originClass);
  }
  retriveOrigin() {
    return Array.from(this.origin);
  }
  updatePosition(coordinates) {
    this.position = coordinates;
  }
}

class HomePane extends Pane {
  _init() {
    this.element.classList.add(this.classes.active);
  }
  _oppositeCoordinantes(coordinates) {
    let output = coordinates;
    for (let i = 0; i < output.length; i++) {
      if (output[i] === 0) {
        continue;
      }
      output[i] *= -1;
    }
    return output;
  }
  activate() {
    let cssClass = this._getPositionClass(this.position);

    this.position = [0, 0];
    // Unfreeze pane and remove order class
    this.element.classList.remove(
      this.classes.frozen,
      this.classes.fixed,
      this._getOrderClass(cssClass)
    );
    // Add active class
    this.element.classList.add(this.classes.active);
    // Restore scroll position
    // this._restoreScrollPosition(this.element);
    this._setWindowScrollPosition();
    // Remove transform class to begin transition
    this.element.classList.remove(cssClass);
    // setTimeout(() => {
    //   this._restoreScrollPosition(window);
    // }, 300);
  }
  deactivate(originOfActivePane) {
    this._storeScrollPosition();
    // Update the position of the pane
    this.position = this._oppositeCoordinantes(originOfActivePane);
    let cssClass = this._getPositionClass(this.position);
    // Take care of most of the classes
    this.element.classList.add(
      this.classes.frozen,
      this.classes.fixed,
      this._getOrderClass(cssClass)
    );
    this.element.classList.remove(this.classes.active);
    // Take care of scroll position
    this._setScrollPositionWhenFixed();
    // Add the transform class to begin transition
    this.element.classList.add(cssClass);
  }
}
class DynamicPane extends Pane {
  constructor(element, inheritedOptions) {
    super(element, inheritedOptions);
    this.inject = new Gingabulous.Inject(element);
  }
}
class CarouselPane extends Pane {
  constructor(element, inheritedOptions) {
    super(element, inheritedOptions);
    this.carousel = this.element.querySelector('[data-carousel-panes]');
    this.titleBar = this.element.querySelector('.pane-carousel-title-bar');
    this._events();
  }
  _goToPane(pane) {
    let translate;
    if (pane === 'left') {
      translate = 'translateX(0)';
    }
    if (pane === 'center') {
      translate = '';
    }
    if (pane === 'right') {
      translate = 'translateX(-200%)';
    }
    this.carousel.style.transform = translate;
    this.titleBar.style.transform = translate;
  }
  _events() {
    let attr = 'data-panes-nav';
    this.element.addEventListener('click', (event) => {
      if (event.target.hasAttribute(attr)) {
        let attrValue = event.target.getAttribute(attr);
        if (attrValue === 'left') {
          this._goToPane('left');
        }
        if (attrValue === 'center') {
          this._goToPane('center');
        }
        if (attrValue === 'right') {
          this._goToPane('right');
        }
      }
    });
  }
}

Gingabulous.registerModule(Pane);
Gingabulous.registerModule(HomePane);
Gingabulous.registerModule(DynamicPane);
Gingabulous.registerModule(CarouselPane);
}();
