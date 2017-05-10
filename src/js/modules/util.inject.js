'use strict';
// - each instance can make as many requests as needed
// - need a way to possibly define where to inject, as well as what to inject from
//   the request.
// - maybe be able to pass an id through the target attr and use that to target the piece
//   of content in the request that should be injected there.
// - Content should only unloaded if new content is suppose to load. That way if the same
//   dynamic content is opened, it doesnt have to load again.
!function() {
class Inject {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend(this.defaults, options);
    this.xhr = new XMLHttpRequest();
    this.api;
    this.activeContent;
    this._init();
  }
  get defaults() {
    return {
      dataAttr: 'data-inject'
    };
  }
  get attr() {
    return {
      container: `${this.options.dataAttr}-container`,
      content:   `${this.options.dataAttr}-content`,
      api:       `${this.options.dataAttr}-api`,
      bind:      `${this.options.dataAttr}-bind`
    };
  }
  get path() {
    return this.element.getAttribute(this.attr.api);
  }
  get boundElements() {
    return this.element.querySelectorAll(`[${this.attr.bind}]`);
  }
  _init() {
    this._ajax();
  }
  _ajax() {
    this.xhr.onreadystatechange = () => this._loadAPI();
    this.xhr.open('GET', this.path);
    this.xhr.send();
  }
  _loadAPI() {
    if (this.xhr.readyState === 4) {
      this.api = JSON.parse(this.xhr.responseText);
      console.log('response text', this.xhr.responseText);
      console.log(this.api);
    }
    console.log(this.api);
  }
  _forEachBindAttr(callback) {
    let binds = this.element.querySelectorAll(`[${this.attr.bind}]`);
    for (let bind in binds) {
      if (Object.prototype.hasOwnProperty.call(binds, bind)) {
        callback(binds[bind]);
      }
    }
  }
  _updateAttr(key) {
    this.element.setAttribute(this.attr.content, key);
  }
  _getContent(objectChain) {
    let data = objectChain.split('.');
    let output = this.activeContent;
    for (let i = 0; i < data.length; i++) {
      output = output[data[i]];
    }
    return output;
  }
  _injectContent() {
    for (let i = 0; i < this.boundElements.length; i++) {
      // Get the object chain to parse.
      let objectChain = this.boundElements[i]
        .getAttribute(this.attr.bind);
      // Inject the content, replacing whatever is already there.
      this.boundElements[i].innerHTML = this._getContent(objectChain);
    }
  }
  updateContent(eventElement) {
    let key = eventElement.getAttribute(this.options.dataAttr);
    // this._updateAttr(key);
    this.activeContent = this.api[key];
    this._injectContent();
  }
}

Gingabulous.Inject = Inject;
}();
