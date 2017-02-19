'use strict';

function Inject(documentPath, contentTarget, options) {
  this.options = this.getOptions(options || {});
  this.xhr = new XMLHttpRequest();
  this.debug = new Debug('Inject', true);
  this.$contentContainer = $('[' + this.options.injectContentAttr + ']');
  this.documentPath = documentPath;
  this.contentTarget = contentTarget;
  this.status = 'no content';
  this.updateStatusAttr();
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
  getStatusAttr: function() {
    return this.options.injectContentAttr + '-status';
  },
  contentHasLoaded: function() {
    if (this.$contentContainer.attr(this.getStatusAttr()) === this.options.contentLoadedValue) {
      return true;
    }
    return false;
  },
  updateStatus: function(status) {
    this.status = status;
    this.updateStatusAttr();
  },
  updateStatusAttr: function() {
    this.$contentContainer.attr(this.getStatusAttr(), this.status);
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
    if (this.contentIsReady()) {
      // Inject Content
      this.$contentContainer.append(this.getContent());
      // Update Status
      this.updateStatus(this.options.contentLoadedValue);
    }
  },
  event: function() {
    if (!this.contentHasLoaded()) {
      this.xhr.onreadystatechange = () => this.injectContent;
      this.xhr.open('GET', this.documentPath);
      this.xhr.send();
    }
  }
};

Gingabulous.registerModule('inject');

// var inject = new Inject('/inject-test/index.html', '.inject-this');
// $(document).ready(function() {
//   $('[data-test-injection]').click(function() {
//     inject.event();
//   });
// });
