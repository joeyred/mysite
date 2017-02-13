'use strict';

module.exports = {
  // Development Server - Browser Sync
  browserSync: {
    server: '_site',
    port:   8000,
    ui:     {port: 8001},
    notify: false, // boolean value, Toggle notifications of bsync activity.
    open:   false // toggle auotmatic opening of webpage upong bsync starting.
  },
  // Styles
  scss: {
    // Autoprefixer browser compatability.
    compatability: ['last 2 versions', 'ie >= 9', 'safari 8'],
    paths:         {
      src:   '_src/scss',
      build: '_site/assets/css'
    },
    options: {
      // Sass Compiler
      sass: {
        includePaths: [
          '_src/scss/base',
          '_src/scss/components',
          '_src/scss/pages',
          '_src/scss/projects'
        ],
        percision: 10
      },
      // Merge Media Queries
      mmq: {
        log: true
      }
    }
  },
  // jQuery
  jquery: {
    paths: {
      src:   '',
      build: '_site/assets/js'
    }
  },
  // JS
  js: {
    paths: {
      src:      '_src/js/**/*.js',
      partials: [
        'src/assets/js/!(app).js',
        'src/assets/js/app.js'
      ],
      build: '_site/assets/js'
    }
  },
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
