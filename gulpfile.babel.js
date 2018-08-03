import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import gulpsmith from 'gulpsmith';
// Metalsmith Modules
import msDebugUI from 'metalsmith-debug-ui';
import msPug from 'metalsmith-pug';
import msPermalinks from 'metalsmith-permalinks';
import msCollections from 'metalsmith-collections';
import msCollectionMetadata from 'metalsmith-collection-metadata';
import msBranch from 'metalsmith-branch';
import msPrism from 'metalsmith-prism';
// Utilities
import extend from 'object-assign-deep';
import yaml from 'js-yaml';
import yargs from 'yargs';
import fs from 'fs';
import _ from 'lodash';
// Config
import settings from './generate-settings';

const $ = loadPlugins({
  rename: {
    'gulp-merge-media-queries': 'mmq'
  }
});
console.log(settings);
// Set up base directories
// const dir = {};
// dir.src = config.source || './src';
// dir.build = config.destination || './build';
// dir.dist = config.deploy || './dist';
// dir.test = config.test || './test';
// dir.node = config.nodeModules || './node_modules';
// dir.bower = config.bowerComponents || './bower_components';

// CLI Flags
const DEPLOY = Boolean(yargs.argv.production);
const FULLTEST = Boolean(yargs.argv.fulltest);
const TEST = Boolean(yargs.argv.test);

function loadYmlData(filepath) {
  let file = fs.readFileSync(filepath, 'utf8');
  return yaml.load(file);
}
function loadJSONData(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}
// function loadData(filepath) {
//   let file = fs.readFileSync(filepath, 'utf8');
//
//   if (file.extension === 'json') {
//     return JSON.parse(file);
//   }
//   if (file.extension === 'yml' || file.extension === 'yaml') {
//     return yaml.load(file);
//   }
//   return null;
// }
// let siteData;
// export function getSiteData(done) {
//   siteData = {
//     skills:    loadYmlData('src/content/skills.yml'),
//     treehouse: loadJSONData('src/content/brianhayes.json')
//   };
//   done();
// }

//
// SERVERS
// ================= //

const servers = {
  dev:  browserSync.create('dev'),
  test: browserSync.create('test')
};

// Development Server
export function serverDev(done) {
  if (!TEST) {
    servers.dev.init(settings.servers.dev);
  }
  done();
}

// Test Server
export function serverTest(done) {
  if (TEST || FULLTEST) {
    servers.test.init(settings.servers.test);
  }
  done();
}
export function startServers(done) {
  if (!TEST) {
    servers.dev.init(settings.servers.dev);
  }
  if (TEST || FULLTEST) {
    servers.test.init(settings.servers.test);
  }
  done();
}
export function reload(done) {
  if (FULLTEST) {
    servers.dev.reload();
    servers.test.reload();
  } else if (TEST) {
    servers.test.reload();
  } else {
    servers.dev.reload();
  }
  done();
}

//
// Pages
// ================= //

let siteData;

const helpers = {
  url: (link) => {
    if (DEPLOY) {
      return settings.pages.metadata.site.url + link;
    }
    return link;
  },
  // included simply for backward compatability
  borderGradiantString: (points, colors) => {
    let slices = [];
    let slice;
    let string = '';
    let currentPercent = 0;
    let previousPercent;

    for (let category in points) {
      if (category !== 'total' && points[category] !== 0) {
        previousPercent = _.round((points[category] / points.total) * 100, 2);
        currentPercent += previousPercent;
        slice = {percent: currentPercent};
        if (colors[category]) {
          slice.color = colors[category];
        }
        // console.log(slice);
        slices.push(slice);
      }
    }
    // console.log(slices);
    for (let i = 0; i < slices.length; i++) {
      if (i === 0) {
        string +=
          `${slices[i].color}, `;
      }
      if (i !== 0 && i < slices.length - 1) {
        string +=
          `${slices[i - 1].color} ${slices[i].percent}%,
          ${slices[i].color} ${slices[i].percent}%, `;
      }
      if (i === slices.length - 1) {
        string +=
          `${slices[i - 1].color} ${slices[i].percent}%,
          ${slices[i].color} ${slices[i].percent}%`;
      }
    }
    // console.log(`conic-gradient(${string})`);
    return string;
  }
};

const filters = {
  markdown: require('jstransformer-markdown-it')
};

const pugArgs = {
  useMetadata: true,
  pretty:      true,
  filters:     {
    markdown: function(block) {
      return filters.markdown.render(block);
    }
  }
};
export function getTreehouseJSON(done) {
  let file = fs.readFileSync('./src/content/brianhayes.json', 'utf8');
  if (file && !DEPLOY) {
    return done();
  }
  return $.remoteSrc('brianhayes.json', {base: 'https://teamtreehouse.com/'})
    .pipe(gulp.dest('./src/content/'));
}

export function getSiteData(done) {
  siteData = {
    skills:    loadYmlData('src/content/skills.yml'),
    treehouse: loadJSONData('src/content/brianhayes.json')
  };
  done();
}

export function runGulpsmith() {
  const ms = gulpsmith(settings.pages.src);
  return gulp.src(settings.pages.src + '/pages/**/*')
    .pipe($.frontMatter()).on('data', function(file) {
      _.assign(file, file.frontMatter);
      delete file.frontMatter;
    })
    .pipe(
      ms
        .metadata({
          build:   {production: DEPLOY},
          site:    settings.pages.metadata.site,
          data:    siteData,
          _:       _,
          filters: filters,
          helpers: helpers
        })
        .use(msDebugUI.report('Metadata Loaded'))
        .use(msCollections(settings.pages.collections.defined))
        .use(msCollectionMetadata(settings.pages.collections.defaults))
        .use(msBranch()
          .pattern(settings.pages.collections.precompile)
          .use(msPug(pugArgs))
        )
        .use(msDebugUI.report('Collections Created'))
        .use(msPug(pugArgs))
        .use(msDebugUI.report('Pug Compiled'))
        // Code Highlighting
        .use(msPrism())
        // Permalinks
        .use(msPermalinks())
        .use(msDebugUI.report('Permalinks Done'))
    )
    .pipe($.if(DEPLOY, gulp.dest(settings.dest.dist), gulp.dest(settings.dest.build)));
}
// Deal with Debug UI weirdness
export function copyDebugUIFilesToBuildDir() {
  return gulp.src('./src/metalsmith/build/**/*')
    .pipe(gulp.dest('./build'));
}
export function deleteDebugUIFiles() {
  return del('./src/metalsmith/build');
}
const debugUIFuckery = gulp.series(
  copyDebugUIFilesToBuildDir,
  deleteDebugUIFiles
);
export {debugUIFuckery};

export function manageCollectionsOutput() {
  return del(settings.pages.collections.delete);
}

export function concatPugMixins() {
  return gulp.src('src/metalsmith/mixins/!(mixins).pug')
    .pipe($.concat('mixins.pug'))
    .pipe(gulp.dest('src/metalsmith/mixins'));
}

export function cleanErrorFilesInBuild() {
  return del('./build/**/*.pug');
}

// Final Site Pages Task
const buildSitePages = gulp.series(
  concatPugMixins,
  cleanErrorFilesInBuild,
  runGulpsmith,
  gulp.parallel(debugUIFuckery, manageCollectionsOutput)
);
export {buildSitePages};

//
// Styles
// ================= //
// TODO Add uncss
export function styles() {
  return gulp.src(`${settings.styles.src}/*.scss`)
    .pipe($.sourcemaps.init())
    .pipe($.sass(settings.styles.options).on('error', $.sass.logError))
    .pipe($.pixrem())
    .pipe($.autoprefixer({browsers: settings.styles.compatability}))
    .pipe($.mmq(settings.styles.mmq))
    .pipe($.if(DEPLOY, $.cssnano()))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest($.if(DEPLOY, settings.styles.dest.dist, settings.styles.dest.build)))
    .pipe(
      servers.dev.stream({ // Inject Styles
        // Force source map exclusion.
        // *This fixes reloading issue on each file change*
        match: '**/*.css'
      })
    )
  ;
}

//
// Scripts
// ================= //
export function scripts() {
  return gulp.src(settings.scripts.partials.main)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', function(e) {
      console.error('\x1b[31m%s\x1b[0m', e.message);
      console.log(e.codeFrame);
      this.emit('end');
    })
    .pipe($.concat('app.js'))
    .pipe($.if(DEPLOY, $.uglify()))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest($.if(DEPLOY, settings.scripts.dest.dist, settings.scripts.dest.build)));
}
// NOTE nonconfigurable for now
export function testScripts() {
  return gulp.src('test/scripts/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('tests.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./test'));
}

//
// Images
// ================= //
export function images() {
  return gulp.src(`${settings.images.src}/**/*`)
    .pipe($.if(DEPLOY,
      $.imagemin(settings.images.options)
    ))
    .pipe($.if(DEPLOY, gulp.dest(settings.images.dest.dist), gulp.dest(settings.images.dest.build)));
}

//
// API
// ================= //
function parseObjectString(string, value) {
  let output = {};
  let previous;
  let chain = string.split('.');
  // If there's just one key, then keep it simple and return the output.
  /** This stops the doubling effect of `key: {key: {}}` */
  if (chain.length === 1) {
    output[chain[0]] = value;
    return output;
  }
  for (let i = 0; i < chain.length; i++) {
    // First key
    if (i === 0) {
      output[chain[i]] = {};
      previous = output[chain[i]];
    }
    // All keys between first & last
    if (i !== 0 && i + 1 !== chain.length) {
      previous[chain[i]] = {};
      previous = previous[chain[i]];
    }
    // Last key
    if (i + 1 === chain.length) {
      previous[chain[i]] = value;
    }
  }
  return output;
}

export function buildAPI() {
  let currentFile;
  let namespace;
  const src = DEPLOY ? settings.dest.dist : settings.dest.build;
  return gulp.src(`${src}/**/*.html`)
    .pipe($.rename(function(path) {
      console.log(path);
      // If string contains '/': parse and pull the last value
      if (path.dirname.indexOf('/') > -1) {
        let arrayFromDirname = path.dirname.split('/');
        console.log(arrayFromDirname);
        // get indexes for object keys
        let namespaceIndex = arrayFromDirname.length - 2;
        let lastIndex = arrayFromDirname.length - 1;
        // set file and key
        path.basename = arrayFromDirname[lastIndex];
        // set namesapce key
        namespace = arrayFromDirname[namespaceIndex];
      } else {
        // make namespace false if there isnt one available
        namespace = -1;
        // Try to remember why I did this...
        path.basename = path.dirname;
      }
      currentFile = path.basename;
    }))
    .pipe($.dom(function() {
      let apiObject = {};
      let output = {};
      let objectChainString;
      let blocks = this.querySelectorAll('[build-api]');

      for (let i = 0; i < blocks.length; i++) {
        objectChainString = blocks[i].getAttribute('build-api');
        apiObject = extend(
          apiObject,
          parseObjectString(objectChainString, blocks[i].innerHTML)
        );
      }
      // handle namespacing
      if (namespace === -1) {
        output[currentFile] = apiObject;
      }
      if (namespace !== -1) {
        if (!output[namespace]) {
          output[namespace] = {};
        }
        output[namespace][currentFile] = apiObject;
      }
      return JSON.stringify(output, null, 2);
    }, false))
    .pipe($.rename(function(path) {
      path.extname = '.json';
    }))
    .pipe($.mergeJson({
      filename: 'api.json'
    }))
    .pipe(
      $.if(
        DEPLOY,
        gulp.dest(`${settings.dest.dist}/api`),
        gulp.dest(`${settings.dest.build}/api`)
      )
    )
  ;
}

export function removeAPIAttr() {
  const src = DEPLOY ? settings.dest.dist : settings.dest.build;
  return gulp.src(`${src}/**/*.html`)
    .pipe($.dom(function() {
      let elements = this.querySelectorAll('[build-api]');

      for (let i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('build-api');
      }
      return this;
    }))
    .pipe($.if(DEPLOY, gulp.dest(settings.dest.dist), gulp.dest(settings.dest.build)));
}

const generateAPIFile = gulp.series(buildAPI, removeAPIAttr);
export {generateAPIFile};

export function clean() {
  if (DEPLOY) {
    return del(settings.dest.dist);
  }
  return del(settings.dest.build);
}

//
// Watch
// ================= //
export function watch() {
  // Styles
  gulp.watch(`${settings.styles.src}/**/*.scss`, styles);
  // Scripts
  gulp.watch(`${settings.scripts.src}/**/*.js`, gulp.series(scripts, reload));
  // Images
  gulp.watch(`${settings.images.src}/**/*`, gulp.series(images, reload));
  if (FULLTEST || TEST) {
    gulp.watch('test/index.html', servers.test.reload());
    gulp.watch('./test/scripts/*.js', gulp.series(testScripts, reload));
  }
  if (FULLTEST || !TEST) {
    gulp.watch(
      [
        'src/metalsmith/**/*',
        '!src/metalsmith/build/**/*',
        '!src/metalsmith/mixins/mixins.pug'
      ],
      gulp.series(buildSitePages, generateAPIFile, reload)
    );
  }
}

export function deploy() {
  return gulp.src(`${settings.dest.dist}/**/*`)
    .pipe($.ghPages());
}

const start = gulp.series(
  clean,
  getTreehouseJSON,
  getSiteData,
  TEST ?
    FULLTEST ?
      gulp.parallel(
        styles,
        scripts,
        testScripts,
        images
      ) :
      gulp.parallel(
        styles,
        scripts,
        testScripts
      ) :
    gulp.parallel(
      styles,
      scripts,
      images
    ),
  TEST ?
    gulp.series(
      startServers,
      watch
    ) :
    gulp.series(
      buildSitePages,
      generateAPIFile,
      startServers,
      watch
    )
);

export {start};
export default start;
