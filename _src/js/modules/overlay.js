!function($) {
'use strict';

/**
 * Overlay Window Module
 * @method Overlay
 * @param  {jQuery} $overlayWindow - jQuery object for the overlay window.
 * @param  {jQuery} $pageContent   - jQuery object for main page content.
 * @param  {String} id             - ID for the overlay.
 * @param  {object} options        - options passed to the constructor.
 */
function Overlay($overlayWindow, $pageContent, id, options) {
  this.options = this.getOptions(options || {});
  this.overlayOpenClass = this.options.overlayOpenClass;
  this.overlayAttr = this.options.overlayAttr;
  this.openButtonAttr = this.options.openButtonAttr;
  this.closeButtonAttr = this.options.closeButtonAttr;
  this.$overlayWindow = $overlayWindow;
  this.$pageContent = $pageContent;
  this.id = id;
}

Overlay.prototype = {
  constructor: Overlay,
  /**
   * Defaults to be used in each overlay object.
   * @type {Object}
   */
  defaults: {
    overlayOpenClass: 'overlay-open',
    overlayAttr:      'data-overlay',
    openButtonAttr:   'data-overlay-open',
    closeButtonAttr:  'data-overlay-close'
  },
  /**
   * Parse any passed options with the default settings.
   * @method getOptions
   * @param  {Object}   options - Passed options into the constructor.
   * @return {Object}           - Parsed options for use in the object.
   */
  getOptions: function(options) {
    return $.extend(true, this.defaults, options);
  },
  /**
   * Builds the button target based on the data attribute passed and the id passed to the
   * Object constructor.
   * @method getButtonTarget
   * @param  {String}        attribute - The attribute name.
   * @return {String}                  - Usable target to be made into a jQuery object.
   */
  getButtonTarget: function(attribute) {
    return '[' + attribute + '="' + this.id + '"]';
  },
  /**
   * Returns the target for the open button.
   * @method getOpenButton
   * @return {String}      - Target for open button.
   */
  getOpenButton: function() {
    return this.getButtonTarget(this.openButtonAttr);
  },
  /**
   * Returns the target for the close button.
   * @method getCloseButton
   * @return {String}       - Target for close button.
   */
  getCloseButton: function() {
    return this.getButtonTarget(this.closeButtonAttr);
  },
  /**
   * Binds and sets the event for opening the overlay.
   * @method bindOpenEvent
   */
  bindOpenEvent: function() {
    var $overlay = this.$overlayWindow;
    var $pageContent    = this.$pageContent;
    var overlayOpenClass = this.overlayOpenClass;
    $(this.getOpenButton()).click(function() {
      $overlay.addClass(overlayOpenClass);
      $pageContent.addClass('disable-scrolling');
      // console.log('open the overlay');
    });
  },
  /**
   * Binds and sets the event for closing the overlay.
   * @method bindCloseEvent
   */
  bindCloseEvent: function() {
    var $overlay = this.$overlayWindow;
    var $pageContent    = this.$pageContent;
    var overlayOpenClass = this.overlayOpenClass;
    $(this.getCloseButton()).click(function() {
      $overlay.removeClass(overlayOpenClass);
      $pageContent.removeClass('disable-scrolling');
      // console.log('close the overlay');
    });
  }
};

var Overlays = {
  overlaysOnPage: $('[data-overlay]'),
  pageBody: $('.site-inner'),

  initOverlays: function() {
    $('[data-overlay]').each(function() {
      var $overlay = $(this);
      var id = $overlay.attr('data-overlay')
      var overlay = new Overlay($overlay, Overlays.pageBody, id);

      overlay.bindOpenEvent();
      overlay.bindCloseEvent();
    })
  }
}

$(document).ready(function() {
  Overlays.initOverlays();
});

}(jQuery);
