!function($) {

// IDEA The Basic Concept:
// -----------------------
// detect panes
// check if a pane is the main content pane
  // if pane is body content position it correctly and allow full scrolling.
  // this will also be push aside when another pane is active.
// all panes need to live either to the right or the left of the viewport

// need to deal with nested panes
  // should nested panes be folded in, and expanded once the parent pane is active?

// IDEA Loop through all panes in document (or element passed to the constructor), and
//      store them in an object. While doing this make a jQuery object out of each and
//      use the id of the element as the key and the jQuery object as the value. Then
//      when a change in state is triggered, the id of the open trigger will pass as the
//      key to access the jQuery object of the new active element.
// NOTE - Would this be slower or faster than just using `find()` or `children()` on the
//        element passed to the constructor?
//      - It comes down to which being faster. One jQuery object that has to continually
//        traverse nodes, or traversing it once on init and accessing from the registered
//        pane elements?
class Panes {

  get defaults() {
    return {
      dataAttr:     Gingabulous.modules.Panes.dataAttr,
      paneDataAttr: 'data-pane'
    };
  }
  get mainPaneAttr() {
    return `${this.options.paneDataAttr}-main`;
  }
  get mainPaneTarget() {
    return `[${this.options.paneDataAttr}-main]`;
  }
  get paneTarget() {
    return `[${this.options.paneDataAttr}]`;
  }
  get panesTarget() {
    return `[${this.options.dataAttr}]`;
  }

  constructor(element, options = {}) {
    this.$element = element;
    this.options = $.extend(true, this.defaults, options);
    this.debug = new Debug('Panes', true);
    this.state = {
      active:   'main',
      previous: false
    };
    this.panes = {};
  }
  init() {
    this.registerMainPane();
    $(this.paneTarget).each((index, element) => this.registerPane(index, element));
    this.debug.values('init', {panes: this.panes});
  }
  registerMainPane() {
    this.panes.main = [$(this.mainPaneTarget), false];
  }
  registerPane(index, element) {
    let $pane = $(element);
    let key = $pane.attr(this.options.paneDataAttr);
    // if the data attr has no value, then it's a nested pane.
    if (key !== '') {
      let children = false;
      let hasChildren = $pane.children(this.panesTarget).attr(this.options.dataAttr);
      // does this pane have children?
      if (hasChildren !== undefined) {
        children = [];
        // time to count the children.
        $pane.children(this.panesTarget).children(this.paneTarget).each(function() {
          // shove the child into the happy funtime playpen array.
          children.push($(this));
        });
      }
      this.panes[key] = [$pane, children];

      this.debug.values('registerPane', {$pane, key, hasChildren, children});
    }
  }
  // bindEvents() {}
  // paneEvents() {}
  // updateActivePane(id) {
  //   this.activePane = id;
  // }
  //
  // openPane() {
  //
  // }
  // closePane() {}
}

Gingabulous.registerModule(Panes);

}(jQuery);
