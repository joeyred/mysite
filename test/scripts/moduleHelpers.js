describe('Module Helper Methods', function() {
  describe('extend()', function() {
    it('Overwrites values in objectA with any matching keys in objectB', function() {
      var objectA = {
        foo: 'hello',
        bar: 'world'
      };
      var objectB = {
        foo: 'goodbye'
      };
      var returnedObject = {
        foo: 'goodbye',
        bar: 'world'
      };
      expect(Gingabulous.extend({}, objectA, objectB)).to.deep.equal(returnedObject);
    });
    it('Returns objectA as it was if objectB is empty', function() {
      var objectA = {
        foo: 'hello',
        bar: 'world'
      };
      var objectB = {};
      expect(Gingabulous.extend({}, objectA, objectB)).to.deep.equal(objectA);
    });
  });

  describe('deepExtend()', function() {
    it('Overwrites values in objectA with any matching keys in objectB', function() {
      var objectA = {
        foo: 'hello',
        bar: 'world'
      };
      var objectB = {
        foo: 'goodbye'
      };
      var returnedObject = {
        foo: 'goodbye',
        bar: 'world'
      };
      expect(Gingabulous.deepExtend({}, objectA, objectB)).to.deep.equal(returnedObject);
    });
    it('Overwrites deep values in objectA with any matching keys in objectB', function() {
      var objectA = {
        foo: {
          greeting: 'hello',
          farewell: 'goodbye'
        },
        bar: 'world'
      };
      var objectB = {
        foo: {
          greeting: 'salutations'
        }
      };
      var returnedObject = {
        foo: {
          greeting: 'salutations',
          farewell: 'goodbye'
        },
        bar: 'world'
      };
      expect(Gingabulous.deepExtend({}, objectA, objectB)).to.deep.equal(returnedObject);
    });
    it('Returns objectA as it was if objectB is empty', function() {
      var objectA = {
        foo: {
          greeting: 'hello',
          farewell: 'goodbye'
        },
        bar: 'world'
      };
      var objectB = {};
      expect(Gingabulous.deepExtend({}, objectA, objectB)).to.deep.equal(objectA);
    });
  });
});
