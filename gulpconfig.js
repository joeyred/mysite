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
  testServer: {
    server: {
      baseDir: 'test',
      routes:  {
        '/jquery':      'bower_components/jquery/dist',
        '/mocha':       'node_modules/mocha',
        '/chai':        'node_modules/chai',
        '/chai-jquery': 'node_modules/chai-jquery',
        '/sinon-chai':  'node_modules/sinon-chai',
        '/sinon':       'node_modules/sinon',
        '/assets':      '_site/assets'
      }
    },
    port:   8002,
    ui:     {port: 8003},
    notify: false,
    open:   false
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
      src:          '_src/js/**/*.js',
      testPartials: [
        '_src/js/modules/core.js',
        '_src/js/modules/util.*.js',
        '_src/js/modules/**.js'
      ],
      partials: [
        '_src/js/modules/core.js',
        '_src/js/modules/util.*.js',
        '!_src/js/dump.js',
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
