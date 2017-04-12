describe('Inject Utility Module', function() {
  var module;
  var html;
  var template = `
    <div data-inject>
      <div data-inject-content="exampleA"></div>
      <div data-inject-content="exampleB"></div>
      <div data-inject-content="exampleC"></div>
    </div>
    <button data-inject=
  `;
  // [
  //  'either the target in the response, or url',
  //  '.selector-of-container-to-inject-into'
  // ]
  var exampleArray = [
    ['#contentA', '#containerA'],
    ['#contentB', '#containerB'],
    ['#contentB', '#containerC']
  ];
  describe('constructor', function() {
    it('', function() {});
  });
  describe('injectContent', function() {
    it('Injects content');
  });
});
