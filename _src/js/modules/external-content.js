'use strict';

function Inject(documentPath, contentTarget, options) {
  this.options = this.getOptions(options || {});
  this.xhr = new XMLHttpRequest();
  this.debug = new Debug('Inject', true);
  this.$contentContainer = $('[' + this.options.injectContentAttr + ']');
  this.documentPath = documentPath;
  this.contentTarget = contentTarget;
}

Inject.prototype = {
  constructor: Inject,

  defaults: {
    injectContentAttr:  'data-inject',
    contentLoadedValue: 'loaded'
  },
  getOptions: function(options) {
    return $.extend(true, this.defaults, options);
  },
  contentHasLoaded: function() {
    if (this.$contentContainer.attr(this.options.injectContentAttr) === 'loaded') {
      return true;
    }
    return false;
  },
  // requiresContentLoaded: function() {
  //   this.debug.values('requiresContentLoaded', {
  //     injectContentAttr: this.options.injectContentAttr,
  //     theReturn:         this.$contentContainer.attr(this.options.injectContentAttr)
  //   });
  //   return this.$contentContainer.attr(this.options.injectContentAttr);
  // },
  contentIsReady: function() {
    return this.xhr.readyState === 4;
  },
  getContent: function() {
    var $response = $(this.xhr.responseText);
    this.debug.functionReturn('getContent', $response);
    return $response.find(this.contentTarget);
  },
  injectContent: function() {
    this.debug.values('injectContent', {readyState: this.xhr.readyState});
    if (this.xhr.readyState === 4) {
      var contentToInject = this.getContent();
      this.debug.functionReturn('injectContent', contentToInject);
      this.$contentContainer.append(contentToInject);
    }
  },
  init: function() {
    console.log('inject fired');
    if (!this.contentHasLoaded()) {
      console.log('no loaded content found. content can be injected now.');
      this.xhr.onreadystatechange = this.injectContent.bind(this);
      this.xhr.open('GET', this.documentPath);
      this.xhr.send();
    }
  }
};
var inject = new Inject($('[data-inject-parent]'), './inject-test/index.html', '.inject-this');
$(document).ready(function() {
  $('[data-test-injection]').click(function() {
    inject.init();
  });
});
