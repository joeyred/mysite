'use strict';

// IDEA Global resize event in core?

// NOTE This should only be used for content containers with scrolling.

!function($) {

class Focus {
  constructor(elements, options = {}) {
    this.$elements = elements;
    this.options = $.extend(true, this.defaults, options);
    this.defaults = {
      dataAttr: 'data-focus'
    };
  }
  init() {
    this.$elements.each(function() {
      var $element = $(this);
      $element.data('hello', 'world');
      var data = $element.data('hello');
      $element.attr('hello', data);
    });
    this.$elements.each(function() {
      console.log($(this).data());
    });
  }
  updateScrollPosition() {}

  // check all elements
  // store scroll position
  // lock all scrolling that of elements, save for the one in "focus"
  // put the one in focus back to its previous scrolling position.

  // METHODS
  // loop through all elements and check for their state.
  // set elements not in focus to a fixed state
  // save scrolling position to element
  //
  // element in focus:
  // unfix the element: remove static height and width
  // restore previos scroll position
  //
  // Need an action to bind to events.
  //
  // Need an updater - This will make the current element focused and the rest not.
}

Gingabulous.registerModule(Focus);

}(jQuery);
