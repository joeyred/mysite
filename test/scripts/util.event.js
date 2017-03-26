describe('Event Utility', function() {
  var event;
  describe('_callbacks', function() {
    it('loops through event array and fires each callback', function() {
      // Set things up
      event = new Gingabulous.EventListener(window, 'scroll');
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      event.callbacks.push(spy1);
      event.callbacks.push(spy2);
      event.callbacks.push(spy3);
      // Run the function
      event._handler();
      // Expectations
      expect(spy1).to.be.calledOnce;
      expect(spy1).to.be.calledBefore(spy2);
      expect(spy1).to.be.calledBefore(spy3);
      expect(spy2).to.be.calledOnce;
      expect(spy2).to.be.calledAfter(spy1);
      expect(spy2).to.be.calledBefore(spy3);
      expect(spy3).to.be.calledOnce;
      expect(spy3).to.be.calledAfter(spy1);
      expect(spy3).to.be.calledAfter(spy2);

      window.removeEventListener('scroll', event._handler);
    });
  });

  describe('_registerEventListener', function() {
    var clickEvent;
    beforeEach(function() {
      clickEvent = new Event('click', {bubbles: true, cancelable: true});
    });

    it('Registers new event listener', function() {
      document.body.insertAdjacentHTML('beforeend', '<button id="test"></button>');
      var element = document.querySelector('#test');
      var click = new Gingabulous.EventListener(element, 'click');
      click._registerEventListener();
      var spy = sinon.spy(click, '_handler');
      element.dispatchEvent(clickEvent);
      expect(spy).to.be.calledOnce;
      // cleanup
      element.removeEventListener('click', click._handler);
      document.body.removeChild(element);
    });
  });

  describe('registerCallback', function() {
    it('Adds the passed callback function to the array of callbacks', function() {
      event = new Gingabulous.EventListener(window, 'scroll');
      var spy = sinon.spy();
      event.registerCallback(spy);

      expect(event.callbacks.length).to.equal(1);
      // Cleanup
      window.removeEventListener('scroll', event._handler);
    });
    it('Throws an error when passed value isnt a function', function() {
      event = new Gingabulous.EventListener(window, 'scroll');
      var spy = sinon.spy(event, 'registerCallback');
      expect(spy).to.throw();
      // Cleanup
      window.removeEventListener('scroll', event._handler);
      event.registerCallback.restore();
    });
    it('Fires #_registerEventListener if the callback is the first be registered', function() {
      event = new Gingabulous.EventListener(window, 'scroll');
      var firedSpy = sinon.spy(event, '_registerEventListener');

      event.registerCallback(function() {});
      event.registerCallback(function() {});
      event.registerCallback(function() {});

      expect(firedSpy).to.be.calledOnce;

      window.removeEventListener('scroll', event._handler);
      event._registerEventListener.restore();
    });
  });
});
