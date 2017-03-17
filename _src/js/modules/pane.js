'use strict';

!function($) {

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
  _getPositionClass() {
    let cssClass = [];
    if (this.position[1] === -1) {
      cssClass.push(this.classes.above);
    }
    if (this.position[1] === 1) {
      cssClass.push(this.classes.below);
    }
    if (this.position[0] === -1) {
      cssClass.push(this.classes.left);
    }
    if (this.position[0] === 1) {
      cssClass.push(this.classes.right);
    }
    if (this.position[0] === 0 && this.position[1] === 0) {
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
    this.scrollPoisiton = window.scrollTop;
  }
  // activate() {}
  // deactivate(scrollPoisiton) {}
  retriveOrigin() {
    return Array.from(this.origin);
  }
}

Gingabulous.registerModule(Pane);
}(jQuery);
