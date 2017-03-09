!function($) {
class Pane {

  constructor(element, position, children, isMain = false) {
    this.element        = element;
    this.origin         = position;
    this.position       = position;
    this.children       = children;
    this.isMain         = isMain;
    this.scrollPosition = 0;
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
}

// Gingabulous.registerChildModule('Panes', Pane);

}(jQuery);
