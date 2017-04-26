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
  constructor(element) {
    this.element = element;
    this.injectTargets = {};
    this.requests = {};
    this.content = {};
  }
  _init() {}
  _registerTargetContainers() {}
  _newRequest(id) {
    this.requests[id] = new XMLHttpRequest();
  }
  removeContent() {}
  injectContent(id) {
    // If the id hasnt been registered yet, then creaet a new xhr object.
    if (!this.requests[id]) {
      this._newRequest(id);
    }
  }
}

Gingabulous.Inject = Inject;
}();
