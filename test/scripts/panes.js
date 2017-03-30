describe('Panes Module', function() {
  var module;
  var html;
  var pane = function(id, cssClass = '') {
    if (cssClass !== '') {
      cssClass = ` ${cssClass}`;
    }
    return `
    <div class="pane${cssClass}" data-pane="${id}">
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
  var template = `
    <div class="panes" data-panes>
      ${pane('exampleA')}
      ${pane('exampleB', 'above')}
      <div class="pane" data-pane="home">
        <button data-pane-open="exampleA"></button>
        <button data-pane-open="exampleB"></button>
      </div>
    </div>
  `;
  beforeEach(function() {
    // Add the template to the document
    document.body.insertAdjacentHTML('beforeend', template);
    // Get it as a DOM node
    html = document.querySelector('[data-panes]');
    // Now init a new insatnce of the module with out template node and options data
    module = new Gingabulous.Panes(html);
    module.init();
  });
  afterEach(function() {
    // Remove the template node when testing is done
    document.body.removeChild(html);
  });
  // Register Panes
  describe('_registerPanes', function() {
    it('Loops through all panes in the document, creating a Pane instance for each',
    function() {
      // module._registerPanes();
      expect(module.panes.exampleA).to.be.an.instanceof(Gingabulous.Pane);
      expect(module.panes.exampleB).to.be.an.instanceof(Gingabulous.Pane);
    });
  });

  describe('_events', function() {
    var clickEvent;
    beforeEach(function() {
      clickEvent = new Event('click', {bubbles: true, cancelable: true});
    });
    it('Fires _updateState when el with an open attr is clicked, passing it the atts id',
    function() {
      var spy = sinon.spy(module, '_updateState');
      html.querySelector('[data-pane-open="exampleA"]').dispatchEvent(clickEvent);
      expect(spy).to.be.calledOnce;
      expect(module.state).to.deep.equal({active: 'exampleA', previous: 'home'});
    });
    it('Fires _updateState when el with a close attr is clicked, passing "home"',
    function() {
      var spy = sinon.spy(module, '_updateState');
      module.state = {active: 'exampleA', previous: 'home'};
      html.querySelectorAll('[data-pane-close]')[0].dispatchEvent(clickEvent);
      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWith('home');
      expect(module.state).to.deep.equal({active: 'home', previous: 'exampleA'});
    });
  });

  describe('_updateState', function() {
    it('Updates the state of panes', function() {
      module._updateState('exampleA');
      expect(module.state).to.deep.equal({active: 'exampleA', previous: 'home'});
    });
    it('Does not update the state if value passed matches the active pane', function() {
      module._updateState('home');
      expect(module.state).to.deep.equal({active: 'home', previous: false});
    });
    it('Fires _updatePositions', function() {
      var spy = sinon.spy(module, '_updatePositions');
      module._updateState('exampleA');
      expect(spy).to.be.calledOnce;
    });
  });

  // Event delegation
  // Register main pane
  // Update state
  //
});
