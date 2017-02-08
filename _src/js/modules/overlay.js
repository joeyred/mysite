'use strict';

!function($) {

function Overlay(options, $modalWindow, id) {
  this.modalOpenClass  = options.modalOpenClass;
  this.modalAttr       = options.modalAttr;
  this.openButtonAttr  = options.openButtonAttr;
  this.closeButtonAttr = options.closeButtonAttr;
  this.$modalWindow    = $modalWindow;
  this.id              = id;
}

Overlay.prototype = {
  constructor: Overlay,

  getButtonTarget: function(attribute) {
    return '[' + attribute + '="' + this.id + '"]';
  },
  hasDocument: function() {
    return this.$modalWindow.attr('data-has-document');
  },
  documentHasLoaded: function() {
    return this.$modalWindow.attr('data-document-loaded');
  },
  getDocument: function(contentTarget, documentPath, loadModules) {
    if (this.hasDocument() && !this.documentHasLoaded()) {

      var sectionTarget = '[data-modal="' + id + '"] [data-document]';
      var $section = $(sectionTarget);
      // New AJAX object
      var xhr = new XMLHttpRequest();
      // NOTE Might need `contentTarget` passed through the function here.
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          // Make the response text a jQuery object.
          var $response = $(xhr.responseText);
          // Grab just the part that we need from the full content jQuery object.
          var $content = $response.find(contentTarget);

          // Inject Content
          $section.append($content);
          // Add data attr stating document has been loaded.
          // TODO Check if this works correctly.
          $modalWindow.attr('data-document-loaded', '');

          // Let's see if we really need this or not, but if we do, then at least check if
          // it's there first.
          if (loadModules !== undefined || loadModules !== null) {
            loadModules();
          }
        }
      };
      xhr.open('GET', documentPath);
      xhr.send();

    }
  },
  getOpenButton: function() {
    return this.getButtonTarget(this.openButtonAttr);
  },
  getCloseBtuuon: function() {
    return this.getButtonTarget(this.closeButtonAttr);
  },
  bindOpenEvent: function() {},
  bindCloseEvent: function() {}
};

}(jQuery);
