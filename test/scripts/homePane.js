describe('HomePane Class', function() {
  var module;
  var html;
  var template = `
    <div class="site-inner main-pane" data-pane="home">
        Content...
    </div>`;
  var coordinates = {
    left:  [-1, 0],
    right: [1, 0],
    above: [0, -1],
    below: [0, 1]
  };
  var classes = {
    panes:  'panes',
    pane:   'pane',
    frozen: 'frozen-pane',
    fixed:  'fixed-pane',
    active: 'active',
    left:   'left',
    right:  'right',
    above:  'above',
    below:  'below'
  };
  beforeEach(function() {
    // Add the template to the document
    document.body.insertAdjacentHTML('beforeend', template);
    // Get it as a DOM node
    html = document.querySelector('[data-pane]');
    // Now init a new insatnce of the module with out template node and options data
    module = new Gingabulous.HomePane(html, {classes});
  });
  afterEach(function() {
    // Remove the template node when testing is done
    document.body.removeChild(html);
    window.scrollTo(0, 0);
  });

  describe('_init', function() {
    it('Adds .active class to pane element', function() {
      expect(module.element.classList.contains(classes.active)).to.be.true;
    });
  });

  describe('_oppositeCoordinantes', function() {
    it('Reverses position coordinates passed.', function() {
      var originalCoordinates = [-1, 0];
      expect(module._oppositeCoordinantes(originalCoordinates)).to.deep.equal([1, 0]);
    });
  });

  describe('activate', function() {
    beforeEach(function() {
      module.position = coordinates.above;
      module.element.classList.remove(classes.active);
      module.element.classList.add(
        classes.frozen,
        classes.fixed,
        `${classes.above}-order`,
        classes.above
      );
    });
    it('Sets position to [0, 0]', function() {
      module.activate();
      expect(module.position).to.deep.equal([0, 0]);
    });
    it('Removes frozen, fixed, order, and transform classes', function() {
      module.activate();
      expect(module.element.classList.contains(classes.frozen)).to.be.false;
      expect(module.element.classList.contains(classes.fixed)).to.be.false;
      expect(module.element.classList.contains(`${classes.above}-order`)).to.be.false;
      expect(module.element.classList.contains(classes.above)).to.be.false;
    });
    it('Adds active class', function() {
      module.activate();
      expect(module.element.classList.contains(classes.active)).to.be.true;
    });
    it('fires #_setWindowScrollPosition', function() {
      var spy = sinon.spy(module, '_setWindowScrollPosition');
      module.activate();
      expect(spy).to.be.calledOnce;
    });
  });

  describe('deactivate', function() {
    var originOfActivePane;
    beforeEach(function() {
      originOfActivePane = coordinates.above;
    });

    it('Fires #_storeScrollPosition', function() {
      var spy = sinon.spy(module, '_storeScrollPosition');
      module.deactivate(originOfActivePane);
      expect(spy).to.be.calledOnce;
    });
    it('Sets position to opposite of active pane\'s origin', function() {
      module.deactivate(originOfActivePane);
      expect(module.position).to.deep.equal(coordinates.below);
    });
    it('Adds frozen, fixed, order, and transform classes', function() {
      module.deactivate(originOfActivePane);
      expect(module.element.classList.contains(classes.frozen)).to.be.true;
      expect(module.element.classList.contains(classes.fixed)).to.be.true;
      expect(module.element.classList.contains(`${classes.below}-order`)).to.be.true;
      expect(module.element.classList.contains(classes.below)).to.be.true;
    });
    it('Removes active class', function() {
      module.deactivate(originOfActivePane);
      expect(module.element.classList.contains(classes.active)).to.be.false;
    });
    it('Fires #_setScrollPositionWhenFixed', function() {
      var spy = sinon.spy(module, '_setScrollPositionWhenFixed');
      module.deactivate(originOfActivePane);
      expect(spy).to.be.calledOnce;
    });
  });
});
