'use strict';

!function() {

class Pane {
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
  constructor(element, inheritedOptions) {
    this.element        = element;
    this.position       = this.origin;
    this.classes        = inheritedOptions.classes;
    this.attr           = inheritedOptions.attr;
    this.target         = inheritedOptions.target;
    this.scrollPosition = 0;
    this._init();
  }
  _init() {
    this.element.classList.add(this.classes.frozen, this.classes.fixed);
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
  _freeze() {
    this.element.classList.add(this.classes.frozen, this.classes.fixed);
  }
  _unfreeze() {
    this.element.classList.remove(this.classes.frozen, this.classes.fixed);
  }
  _storeScrollPosition() {
    this.scrollPoisiton = this.element.scrollTop;
  }
  _restoreScrollPosition() {
    window.scrollTo(0, this.scrollPoisiton);
    // this.element.scrollTop(this.scrollPoisiton);
  }
  _transform() {
    let cssClass = this._getPositionClass(this.position);
    // If the value is `false`, position is [0, 0]
    // and transform class needs to be removed.
    if (cssClass) {
      this.element.classList.add(cssClass);
    } else {
      this.element.classList.remove(this._getPositionClass(this.origin));
    }
  }
  // activate() {}
  // deactivate(scrollPoisiton) {}
  retriveOrigin() {
    return Array.from(this.origin);
  }
  updatePosition(coordinates) {
    this.position = coordinates;
  }
}

Gingabulous.registerModule(Pane);
}();
