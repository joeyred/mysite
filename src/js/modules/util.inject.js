!function() {

class Inject {
  constructor(element, options) {
    this.element = element;
    this.options = Gingabulous.deepExtend(Inject.defaults(), options);
    this.xhr = new XMLHttpRequest();
    this.api;
    this.activeContent;

    this._init();
    console.log(this);
  }
  static defaults() {
    return {
      dataAttr: 'data-inject',
      /**
       * When to make the xhr request.
       * @type {Boolean}
       */
      onLoad:   true
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
  get boundElements() {
    return this.element.querySelectorAll(`[${this.attr.bind}]`);
  }
  _init() {
    this._ajax();
  }
  /**
   * Takes a string representaion of an object chain and traverses the real object to the
   * last key in the chain.
   *
   * @method _traverseObject
   * @private
   * @param  {String}       chain  - String represenation of an object chain.
   * @param  {Object}       object - The object to traverse.
   * @return {*}                   - The new position in the object.
   */
  _traverseObject(chain, object) {
    const keys = chain.split('.');
    let output = object;
    for (let i = 0; i < keys.length; i++) {
      output = output[keys[i]];
    }
    return output;
  }
  /**
   * parses the response text and loads it into the api property
   *
   * @method _loadAPI
   * @private
   */
  _loadAPI() {
    if (this.xhr.readyState === 4) {
      this.api = JSON.parse(this.xhr.responseText);
    }
  }
  /**
   * handles the get request on the xhr object
   *
   * @method _ajax
   * @private
   */
  _ajax() {
    this.xhr.onreadystatechange = () => this._loadAPI();
    this.xhr.open('GET', this.element.getAttribute(this.attr.api));
    // this.xhr.open('GET', this.path);
    this.xhr.send();
  }
  _injectContent() {
    for (let i = 0; i < this.boundElements.length; i++) {
      // Get the object chain to parse.
      let chain = this.boundElements[i].getAttribute(this.attr.bind);
      // Inject the content, replacing whatever is already there.
      this.boundElements[i].innerHTML = this._traverseObject(chain, this.activeContent);
    }
  }
  /**
   * Updates the content of the bound elements inner HTML based on a key or object chain
   * passed as a string.
   *
   * @method updateContent
   * @fires Inject#_injectContent
   * @param  {String}      chain - the object chain that leads to the base object to use.
   */
  updateContent(chain) {
    this.activeContent = this._traverseObject(chain, this.api);
    this._injectContent();
  }
}

Gingabulous.Inject = Inject;
}();
