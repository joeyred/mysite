describe('Inject Utility Module', function() {
  var server;
  var module;
  var html;
  var template = `
    <div data-inject-api="example/url/api.json" data-inject-content>
      <div data-inject-bind="exampleA"></div>
      <div data-inject-bind="exampleB"></div>
      <div>
        <div data-inject-bind="exampleC.childA"></div>
        <div data-inject-bind="exampleC.childB"></div>
        <div data-inject-bind="exampleC.childC"></div>
      </div>
    </div>
    <button data-inject="contentA"></button>
    <button data-inject="contentB"></button>
  `;
  var exampleAPIPathValue = [
    ['exampleA', 'path/to/api.json']
  ];
  var exampleAPIObject = {
    contentA: {
      exampleA: 'parent A content',
      exampleB: 'parent B content',
      exampleC: {
        childA: 'parent C - child A content',
        childB: 'parent C - child B content',
        childC: 'parent C - child C content'
      }
    },
    contentB: {
      exampleA: 'parent A content',
      exampleB: '<h1>Look at This Content!</h1><p>It\'s pretty awesome right?</p>',
      exampleC: {
        childA: 'Content',
        childB: '',
        childC: 'parent C - child C content'
      }
    }
  };

  beforeEach(function() {
    // Add the template to the document
    document.body.insertAdjacentHTML('beforeend', template);
    // Get it as a DOM node
    html = document.querySelector('[data-inject-api]');
    // module instance
    module = new Gingabulous.Inject(html);
  });

  afterEach(function() {
    document.body.removeChild(html);
  });

  describe('constructor', function() {
    it('', function() {});
  });

  describe('_ajax', function() {
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });
    afterEach(function() {
      server.restore();
    });
    it('Gets API data from local server', function() {
      server.respondWith('GET', 'example/url/api.json', [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(exampleAPIObject)
      ]);
      var spy = sinon.spy(module, '_loadAPI');
      module._ajax();
      server.respond();
      expect(spy).to.be.called;
      module._loadAPI.restore();
    });
  });

  describe('_loadAPI', function() {
    beforeEach(function() {
      server = sinon.fakeServer.create();
      // module.xhr = sinon.useFakeXMLHttpRequest();
    });
    afterEach(function() {
      server.restore();
      // module.xhr.restore();
    });
    it('Parses and stores JSON as a JS object', function() {
      server.respondWith('GET', 'example/url/api.json', [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(exampleAPIObject)
      ]);
      console.log(JSON.stringify(exampleAPIObject));
      module.xhr.onreadystatechange = function() {
        return module._loadAPI();
      };
      module.xhr.open('GET', 'example/url/api.json');
      module.xhr.send();
      // module._ajax();
      server.respond();
      expect(module.api).to.deep.equal(exampleAPIObject);
    });
  });

  describe('_updateAttr', function() {
    it('Updates data-inject-content with the param value passed',
    function() {
      let example = 'exampleValue';
      module._updateAttr(example);
      // expect(module.activeContent).to.equal(example);
      expect(html.getAttribute('data-inject-content')).to.equal(example);
    });
  });

  describe('_getContent', function() {
    var exampleObject = {
      foo: {
        bar: {
          zip: {
            zap: 'hello'
          }
        }
      }
    };
    it('Correctly parses object chain and outputs content', function() {
      module.activeContent = exampleObject;
      expect(module._getContent('foo.bar.zip.zap'))
      .to
      .equal(exampleObject.foo.bar.zip.zap);
    });
  });

  describe('injectContent', function() {
    it('Injects content provided');
  });
});
