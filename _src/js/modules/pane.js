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
    this.position       = this.origin;
    this.classes        = inheritedOptions.classes;
    this.attr           = inheritedOptions.attr;
    this.target         = inheritedOptions.target;
    this.scrollPosition = 0;
    this._init();
  }
  /**
   * Returns the coordinates of the pane's origin based on it's class on document load.
   * @method origin
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
  get origin() {
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
  get originClass() {
    return this._getPositionClass(this.origin);
  }
  /**
   * Initializes the pane by adding the proper classes for an inactive pane.
   * @method _init
   * @private
   */
  _init() {
    this.element.classList.add(this.classes.frozen, this.classes.fixed);
    this.element.classList.add(this.originClass);
  }
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
  _freeze() {
    this.element.classList.add(this.classes.frozen, this.classes.fixed);
  }
  _unfreeze() {
    this.element.classList.remove(this.classes.frozen, this.classes.fixed);
  }
  _toggleActiveClass() {
    this.element.classList.toggle(this.classes.active);
  }
  _toggleOrderClass(cssClass) {
    this.element.classList.toggle(this._getOrderClass(cssClass));
  }
  _storeScrollPosition() {
    this.scrollPosition = document.body.scrollTop;
  }
  _restoreScrollPosition(element) {
    if (element === window) {
      element.scrollTo(0, this.scrollPosition);
    } else {
      element.scrollTop = this.scrollPosition;
    }
  }
  _transform(cssClass) {
    // If the value is `false`, position is [0, 0]
    // and transform class needs to be removed.
    if (cssClass) {
      this.element.classList.add(cssClass);
    } else {
      this.element.classList.remove(this.originClass);
    }
  }
  activate() {
    // Update the position of the pane
    this.position = [0, 0];
    // let cssClass = this._getPositionClass(this.position);
    // Update position
    // Unfreeze pane
    this.element.classList.remove(this.classes.frozen, this.classes.fixed);
    // Remove flex order class
    this.element.classList.remove(this._getOrderClass(this.originClass));
    // Add active class
    this.element.classList.add(this.classes.active);
    // Restore scroll position
    this._restoreScrollPosition(window);
    // Remove transform class to begin transition
    this.element.classList.remove(this.originClass);
  }
  deactivate() {
    // Update the position of the pane
    this.position = this.origin;
    // let cssClass = this._getPositionClass(this.position);
    // Take care of most of the classes
    this.element.classList.add(
      this.classes.frozen,
      this.classes.fixed,
      this._getOrderClass(this.originClass)
    );
    this.element.classList.remove(this.classes.active);
    // Take care of scroll position
    this._storeScrollPosition();
    this._restoreScrollPosition(this.element);
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
  activate() {}
  deactivate() {}
}

// Gingabulous.Panes.Pane = Pane;
// Gingabulous.registerChildModule('Panes', Pane);
// Gingabulous.Panes.HomePane = HomePane;
Gingabulous.registerModule(Pane);
Gingabulous.registerModule(HomePane);
}();
