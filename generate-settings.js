var yaml = require('js-yaml');
var fs = require('fs');

var config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

var dir = {};
// Assign base directories
dir.src = config.source ? './' + config.source : './src';
dir.build = config.destination ? './' + config.destination : './build';
dir.dist = config.deploy ? './' + config.deploy : './dist';
dir.test = config.test ? './' + config.test : './test';
dir.node = config.node ? './' + config.node : './node_modules';
dir.bower = config.bower ? './' + config.bower : './bower_components';

// Assign sub directories in source directory
dir.styles = config.styles ? './' + dir.src + '/' + config.styles : './' + dir.src + '/css';
dir.scripts = config.scripts ? './' + dir.src + '/' + config.scripts : './' + dir.src + '/js';
dir.images = config.images ? './' + dir.src + '/' + config.images : './' + dir.src + '/imgs';
dir.pages = config.templates ? './' + dir.src + '/' + config.templates : './' + dir.src + '/metalsmith';

function generateAssetFilepath(base, sub) {
  if (config.assets.subDir) {
    return base + '/assets/' + sub;
  }
  return base + '/' + sub;
}
function getPath(base, sub, glob) {
  if (glob) {
    return base + '/' + sub + '/' + glob;
  }
  return base + '/' + sub;
}
function handleIncludedPaths(base, directories) {
  var _output = [];
  if (!directories) {
    return false;
  }
  for (var _i = 0; _i < directories.length; _i++) {
    _output.push(getPath(base, directories[_i]));
  }
  return _output;
}
function handleCollections() {
  var collections = {
    defined:    {},
    defaults:   {},
    delete:     [],
    precompile: []
  };
  var name;
  var defaults;
  for (var collection in config.collections) {
    if ({}.hasOwnProperty.call(config.collections, collection)) {
      // get the proper key
      name = config.collections[collection].key || collection;
      // set the pattern
      collections.defined[name] = {
        pattern: name + '/**/*.pug'
      };
      // handle setting metadata defaults for the collection
      if (config.collections[collection].defaults) {
        defaults = config.collections[collection].defaults;
        for (var setting in defaults) {
          if ({}.hasOwnProperty.call(defaults, setting)) { // eslint-disable-line
            collections.defaults['collections.' + name][setting] = defaults[setting];
          }
        }
      }
      // handle deleting output files if needed
      // but no deleting index files
      if (!config.collections[collection].output) {
        collections.delete.push(
          dir.pages + '/' + collection + '/**/*',
          '!' + dir.pages + '/' + collection + '/index.html'
        );
      }
      // Handle preprocessing/precompiling
      if (config.collections[collection].precompile) {
        collections.percompile.push(collection + '/**/*.pug');
      }
    }
  }
  return collections;
}

module.exports = {
  dest: {
    build: dir.build,
    dist:  dir.deploy,
    test:  dir.test
  },
  //
  // SERVERS
  // ================= //
  servers: {
    dev: {
      server: dir.build,
      port:   config.servers.port || 8000,
      ui:     {port: config.servers.port + 1 || 8001},
      notify: config.servers.notify || false,
      open:   config.servers.open || false
    },
    test: {
      server: {
        baseDir: dir.test,
        routes:  {
          '/jquery':      `${dir.bower}/jquery/dist`,
          '/mocha':       `${dir.node}/mocha`,
          '/chai':        `${dir.node}/chai`,
          '/chai-jquery': `${dir.node}/chai-jquery`,
          '/sinon-chai':  `${dir.node}/sinon-chai`,
          '/sinon':       `${dir.node}/sinon`,
          '/assets':      `${dir.build}/assets`
        }
      },
      port:   config.servers.port + 2 || 8002,
      ui:     {port: config.servers.port + 3 || 8003},
      notify: config.servers.notify || false,
      open:   config.servers.open || false
    }
  },
  //
  // Pages
  // ================= //
  pages: {
    src:      dir.pages,
    metadata: {
      site: {
        title:  config.title || 'A Site Built With Gulp',
        url:    config.url || 'http://mydomain.com',
        email:  config.email || 'example@example.com',
        social: config.social || null
      }
    },
    collections: handleCollections()
  },
  //
  // Styles
  // ================= //
  styles: {
    src:  dir.styles,
    dest: {
      build: generateAssetFilepath(dir.build, config.assets.styles.destination || 'css'),
      dist:  generateAssetFilepath(dir.dist, config.assets.styles.destination || 'css')
    },
    compatability: config.assets.styles.compatability || [],
    options:       {
      includePaths: handleIncludedPaths(dir.styles, config.assets.styles.includeDirectories) || [],
      percision:    config.assets.styles.percision || 10
    },
    mmq: {
      log: config.assets.styles.logs || true
    }
  },
  //
  // Scripts
  // ================= //
  scripts: {
    src:  dir.scripts,
    dest: {
      build: generateAssetFilepath(dir.build, config.assets.scripts.destination || 'js'),
      dist:  generateAssetFilepath(dir.dist, config.assets.scripts.destination || 'js')
    },
    partials: {
      main: handleIncludedPaths(dir.scripts, config.assets.scripts.partials) || [],
      test: handleIncludedPaths(dir.scripts, config.assets.scripts.test.partials) || []
    }
  },
  //
  // Images
  // ================= //
  images: {
    src:  dir.images,
    dest: {
      build: generateAssetFilepath(dir.build, config.assets.images.destination || 'imgs'),
      dist:  generateAssetFilepath(dir.dist, config.assets.images.destination || 'imgs')
    },
    options: {
      optimizationLevel: config.assets.images.optimization || 7,
      progressive:       config.assets.images.progressive || true,
      interlaced:        config.assets.images.interlaced || true,
      multipass:         config.assets.images.multipass || true
    }
  }
};
