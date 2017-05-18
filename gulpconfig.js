'use strict';

var PATHS = {
  src:   'src',
  build: 'build',
  dist:  'dist',
  test:  'test',
  node:  'node_modules',
  bower: 'bower_components'
};

module.exports = {
  // Development Server - Browser Sync
  devServer: {
    server: PATHS.build,
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
        '/assets':      PATHS.build + '/assets'
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
      src:   PATHS.src + '/scss',
      build: PATHS.build + '/assets/css'
    },
    options: {
      // Sass Compiler
      sass: {
        includePaths: [
          PATHS.src + '/scss/base',
          PATHS.src + '/scss/components',
          PATHS.src + '/scss/pages',
          PATHS.src + '/scss/projects'
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
      build: PATHS.build + '/assets/js'
    }
  },
  // JS
  js: {
    paths: {
      src:          PATHS.src + '/js/**/*.js',
      testPartials: [
        PATHS.src + '/js/modules/core.js',
        PATHS.src + '/js/modules/util.*.js',
        PATHS.src + '/js/modules/**.js'
      ],
      partials: [
        PATHS.src + '/js/modules/core.js',
        PATHS.src + '/js/modules/util.*.js',
        '!' + PATHS.src + '/js/dump.js',
        PATHS.src + '/js/**/!(app).js',
        PATHS.src + '/js/app.js'
      ],
      build: PATHS.build + '/assets/js'
    }
  },
  // Images
  images: {
    paths: {
      src:   PATHS.src + '/imgs/**/*',
      build: PATHS.build + '/assets/imgs'
    },
    options: {
      optimizationLevel: 7,
      progressive:       true,
      interlaced:        true,
      multipass:         true
    }
  }
};
