describe('Pane Constructor', function() {
  var module;
  var html;
  var template = function(cssClass) {
    cssClass = ` ${cssClass}`;
    return `
    <div class="pane${cssClass}" data-pane="example">
      <div class="pane-header">
        <div class="top-bar">
          <div class="left">
            <button class="icon-button" data-pane-close>
              Close
            </button>
          </div>
        </div>
      </div>
      <div class="pane-content">
        Content...
      </div>
    </div>
    `;
  };
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
    left:   'left',
    right:  'right',
    above:  'above',
    below:  'below'
  };
  var attr = {
    parent: 'data-panes',
    main:   '$data-pane-main',
    pane:   'data-pane',
    open:   'data-pane-open',
    close:  'data-pane-close'
  };
  var target = {
    parent: '[data-panes]',
    main:   '[$data-pane-main]',
    pane:   '[data-pane]',
    open:   '[data-pane-open]',
    close:  '[data-pane-close]'
  };

  beforeEach(function() {
    // Add the template to the document
    document.body.insertAdjacentHTML('beforeend', template('left'));
    // Get it as a DOM node
    html = document.querySelector('[data-pane]');
    // Now init a new insatnce of the module with out template node and options data
    module = new Gingabulous.Pane(html, {classes, attr, target});
  });
  afterEach(function() {
    // Remove the template node when testing is done
    document.body.removeChild(html);
  });

  describe('constructor', function() {
    it('Should store DOM node correctly', function() {
      expect(module.element).to.equal(html);
    });
    it('Calculates the origin & position of the pane based on it\'s CSS class', function() {
      expect(module.origin).to.deep.equal(coordinates.left);
      expect(module.position).to.deep.equal(coordinates.left);
    });
    it('Inherits options passed to it by the parent module', function() {
      expect(module.classes).to.deep.equal(classes);
      expect(module.attr).to.deep.equal(attr);
      expect(module.target).to.deep.equal(target);
    });
  });
  describe('get origin', function() {
    it('Return the proper origin based on the pane\'s CSS class', function() {
      expect(module.origin).to.deep.equal(coordinates.left);
    });
  });
  describe('_init', function() {
    it('Adds frozen and fixed css classes to the element', function() {
      expect(module.element.classList.contains(classes.frozen)).to.be.true;
      expect(module.element.classList.contains(classes.fixed)).to.be.true;
    });
  });

  describe('_getPositionClass', function() {
    it('Returns "left" if position is [-1, 0]', function() {
      module.position = [-1, 0];
      expect(module._getPositionClass()).to.equal('left');
    });

    it('Returns "right" if position is [1, 0]', function() {
      module.position = [1, 0];
      expect(module._getPositionClass()).to.equal('right');
    });

    it('Returns "above" if position is [0, -1]', function() {
      module.position = [0, -1];
      expect(module._getPositionClass()).to.equal('above');
    });

    it('Returns "below" if position is [0, 1]', function() {
      module.position = [0, 1];
      expect(module._getPositionClass()).to.equal('below');
    });

    it('Returns false if position is [0, 0]', function() {
      module.position = [0, 0];
      expect(module._getPositionClass()).to.be.false;
    });
  });

  describe('_freeze', function() {
    it('Adds frozen and fixed classes', function() {
      // Run the function to remove the classes.
      module._unfreeze();
      // Run the function to add them again.
      module._freeze();
      // Check the results on the element.
      expect(module.element.classList.contains(classes.frozen)).to.be.true;
      expect(module.element.classList.contains(classes.fixed)).to.be.true;
    });
  });

  describe('_unfreeze', function() {
    it('Removes frozen and fixed classes', function() {
      // Run the function
      module._unfreeze();
      // Check the results on the element.
      expect(module.element.classList.contains(classes.frozen)).to.be.false;
      expect(module.element.classList.contains(classes.fixed)).to.be.false;
    });
  });

  describe('_storeScrollPosition', function() {
    it('Stores the current window scroll position in ScrollPosition', function() {
      module._storeScrollPosition();
      expect(module.scrollPosition).to.equal(module.element.scrollTop);
    });
  });
  // describe('activate', function() {
  //   it('Removes frozen and fixed classes before the transition', function() {
  //
  //     expect(module.element.classList.contains(classes.frozen)).to.be.false;
  //     expect(module.element.classList.contains(classes.fixed)).to.be.false;
  //     expect(module.element.classList.contains('left')).to.be.true;
  //   });
  // });
}); // End of Suite
