'use strict';

module.exports = {
  // Development Server - Browser Sync
  browserSync: {
    server: '_site',
    port:   8000,
    ui:     {port: 8001},
    notify: false, // boolean value, Toggle notifications of bsync activity.
    open:   false, // toggle auotmatic opening of webpage upong bsync starting.
    // routes: {
    //   "/test": 'test',
    //   "/mocha": "node_modules/mocha",
    //   "/chai": "node_modules/chai"
    // }
  },
  testServer: {
    server: 'test',
    port:   8000,
    ui:     {port: 8001},
    notify: false,
    open:   false,
    routes: {
      "/jquery": "bower_components/jquery/dist",
      "/mocha": "node_modules/mocha",
      "/chai": "node_modules/chai"
    }
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
        '_src/js/modules/core.js',
        '_src/js/modules/util.*.js',
        '_src/js/**/!(app).js',
        '_src/js/app.js'
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
