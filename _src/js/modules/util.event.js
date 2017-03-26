!function() {
  // Need to be able to register global events in a way that exposes them so other modules
  // can hook into the callback on those events.
class EventListener {
  constructor(element, listener) {
    this.element = element;
    this.listener = listener;
    this.callbacks = [];
    this.registered = false;
  }
  _handler() {
    if (this.callbacks.length > 0) {
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]();
      }
    }
  }
  _registerEventListener() {
    this.element.addEventListener(this.listener, () => this._handler());
  }
  registerCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    } else {
      throw new TypeError(`callback must be a function, not a ${typeof callback}`);
    }
    if (this.callbacks.length > 0 && !this.registered) {
      this._registerEventListener();
      this.registered = true;
    }
  }
}

const registerGlobalEventListener = function(name, element, listener) {
  if (Gingabulous.events[name] === undefined) {
    Gingabulous.events[name] = new Gingabulous.EventListener(element, listener);
  }
};

Gingabulous.events = {};
Gingabulous.registerGlobalEventListener = registerGlobalEventListener;
Gingabulous.EventListener = EventListener;
}();
