'use strict';

module.exports = {
  // Development Server - Browser Sync
  browserSync: {
    server: '_site',
    port:   8000,
    ui:     8001,
    notify: false, // boolean value, Toggle notifications of bsync activity.
    open:   false // toggle auotmatic opening of webpage upong bsync starting.
  },
  // Styles
  scss: {
    // Autoprefixer browser compatability.
    compatability: ['last 2 versions', 'ie >= 9', 'safari 8'],
    paths:         {
      src: [
        '_src/scss',
        '_src/scss/base',
        '_src/scss/components',
        '_src/scss/pages',
        '_src/scss/projects'
      ],
      build: '_site/assets/css'
    }
  },
  // JS
  // Images
  images: {
    paths: {
      src:   '_src/imgs/**/*',
      build: '_site/assets/imgs'
    },
    options: {
      optimizationLevel: 7,
      progressive:       true,
      interlaced:        true,
      multipass:         true
    }
  }
};
