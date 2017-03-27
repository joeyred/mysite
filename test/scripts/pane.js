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
    active: 'active',
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
    window.scrollTo(0, 0);
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
    it('Returns "left" if coordinates are [-1, 0]', function() {
      expect(module._getPositionClass([-1, 0])).to.equal('left');
    });

    it('Returns "right" if coordinates are [1, 0]', function() {
      expect(module._getPositionClass([1, 0])).to.equal('right');
    });

    it('Returns "above" if coordinates are [0, -1]', function() {
      expect(module._getPositionClass([0, -1])).to.equal('above');
    });

    it('Returns "below" if coordinates are [0, 1]', function() {
      expect(module._getPositionClass([0, 1])).to.equal('below');
    });

    it('Returns false if coordinates are [0, 0]', function() {
      expect(module._getPositionClass([0, 0])).to.be.false;
    });

    it('Doesnt overwrite the value passed', function() {
      var origin = module.origin;
      module._getPositionClass(module.origin);
      expect(module.origin).to.deep.equal(origin);
    });
  });

  describe('_getOrderClass', function() {
    it('Ammends the position class with "-order"', function() {
      var positionClass = 'left';
      expect(module._getOrderClass(positionClass)).to.equal('left-order');
    });
  });

  // describe('_freeze', function() {
  //   it('Adds frozen and fixed classes', function() {
  //     // Run the function to remove the classes.
  //     module._unfreeze();
  //     // Run the function to add them again.
  //     module._freeze();
  //     // Check the results on the element.
  //     expect(module.element.classList.contains(classes.frozen)).to.be.true;
  //     expect(module.element.classList.contains(classes.fixed)).to.be.true;
  //   });
  // });
  //
  // describe('_unfreeze', function() {
  //   it('Removes frozen and fixed classes', function() {
  //     // Run the function
  //     module._unfreeze();
  //     // Check the results on the element.
  //     expect(module.element.classList.contains(classes.frozen)).to.be.false;
  //     expect(module.element.classList.contains(classes.fixed)).to.be.false;
  //   });
  // });

  describe('_storeScrollPosition', function() {
    it('Stores the current window scroll position in ScrollPosition', function() {
      module.element.classList.remove(classes.frozen, classes.fixed);
      // module.element.style.height = '1000px';
      window.scrollTo(0, 100);
      module._storeScrollPosition();
      expect(module.scrollPosition).to.equal(100);
    });
  });

  describe('_restoreScrollPosition', function() {
    it('Sets the scroll position of passed element to the value stored in scrollPosition',
    function() {
      module.element.classList.remove(classes.frozen, classes.fixed);
      // module.element.style.height = '1000px';
      module.scrollPosition = 100;
      module._restoreScrollPosition(window);
      expect(document.body.scrollTop).to.equal(100);
    });
  });

  // describe('_transform', function() {
  //   it('Removes the transform class if position is [0, 0]', function() {
  //     // Set up the correct module state
  //     module.position = [0, 0];
  //     // run the function
  //     module._transform();
  //     // what we expect to happen
  //     expect(module.element.classList.contains(classes.left)).to.be.false;
  //   });
  //
  //   it('Adds the transform class if position is the pane\'s origin', function() {
  //     // Set up the correct module state
  //     module.element.classList.remove(classes.left);
  //     // module.position = module.origin;
  //     // run the function
  //     module._transform('left');
  //     // what we expect to happen
  //     expect(module.element.classList.contains(classes.left)).to.be.true;
  //   });
  // });

  describe('updatePosition', function() {
    it('Updates the position property on the Pane instance', function() {
      module.updatePosition([0, 0]);
      expect(module.position).to.deep.equal([0, 0]);
    });
  });
  describe('activate', function() {
    context('Before the transition', function() {
      it('Removes frozen and fixed classes', function() {
        module.activate();
        expect(module.element.classList.contains(classes.frozen)).to.be.false;
        expect(module.element.classList.contains(classes.fixed)).to.be.false;
      });
      it('Removes flex order class and adds active class', function() {
        module.activate();
        expect(module.element.classList.contains('left-order')).to.be.false;
        expect(module.element.classList.contains(classes.active)).to.be.true;
      });
      it('Removes tansform class', function() {
        module.activate();
        expect(module.element.classList.contains('left')).to.be.false;
      });
    });
  });
  describe('deactivate', function() {
    beforeEach(function() {
      module.element.classList.remove(
        classes.frozen,
        classes.fixed,
        'left-order'
      );
      module.element.classList.add(classes.active);
      module.element.classList.remove('left');
    });
    context('Before the transition', function() {
      it('Adds frozen, fixed, and order classes, and removes active class', function() {
        module.deactivate();
        expect(module.element.classList.contains(classes.frozen)).to.be.true;
        expect(module.element.classList.contains(classes.fixed)).to.be.true;
        expect(module.element.classList.contains('left-order')).to.be.true;
        expect(module.element.classList.contains(classes.active)).to.be.false;
      });
      it('Fires #_storeScrollPosition', function() {
        var spy = sinon.spy(module, '_storeScrollPosition');
        module.deactivate();
        expect(spy).to.be.calledOnce;
        // Cleanup
        module._storeScrollPosition.restore();
      });
      it('Fires #_restoreScrollPosition passing the pane as the element', function() {
        var spy = sinon.spy(module, '_restoreScrollPosition');
        module.deactivate();
        expect(spy).to.be.calledOnce;
        expect(spy).to.be.calledWith(module.element);
        // Cleanup
        module._restoreScrollPosition.restore();
      });
      it('Adds the transform class to begin transition', function() {
        module.deactivate();
        expect(module.element.classList.contains('left')).to.be.true;
      });
    });
  });
}); // End of Suite
