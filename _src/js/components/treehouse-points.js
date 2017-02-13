'use strict';

(function($){

  function PointsVisualizer(points) {
    this.points = points;
  }

  PointsVisualizer.prototype = {
    constructor: PointsVisualizer
    // store total points
    // create percentages of total points for each points category

    // - get width & height of container (and possibly window).
    // - make sure minimum height is met.
    // - based on height and width of container, get square pixels available.
    // - apply percentages of points categories to container's square pixels value and
    //   store individual values to be used for visualized blocks.
    // - somehow turn the square pixel values of each point category into usable height &
    //   width that will properly distribute the blocks to fill the entire container.
  };

})(jQuery);
