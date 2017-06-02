describe('Card class', function() {
  var module;
  var html;
  var template = `
    <div class="card bright horizontal after" data-card>
      <div class="card-options-bar">
        <span class="icon" data-card-close></span>
        <button class="button"></button>
      </div>
      <div class="card-cover">
        <div class="card-thumbnail">
        </div>
        <div class="card-info">
        </div>
      </div>
      <div class="bottom-container">
      </div>
    </div>
  `;
  beforeEach(function() {
    // Add the template to the document
    document.body.insertAdjacentHTML('beforeend', template);
    // Get it as a DOM node
    html = document.querySelector('[data-card]');
    // Now init a new insatnce of the module with out template node and options data
    module = new Gingabulous.Card(html, {});
  });
  afterEach(function() {
    // Remove the template node when testing is done
    document.body.removeChild(html);
  });
  describe('constructor', function() {});
  describe('_expand', function() {
    it('Adds expand style to element', function() {
      module._expand();
      expect(module.element.classList.contains('expanded')).to.be.true;
    });
  });
  describe('_collapse', function() {
    it('Removes expand style from element', function() {
      module.element.classList.add('expanded');
      expect(module.element.classList.contains('expanded')).to.be.true;
      module._collapse();
      expect(module.element.classList.contains('expanded')).to.be.false;
    });
  });
});
