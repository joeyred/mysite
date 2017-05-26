'use babel';

const gulp        = require('gulp');
const $           = require('gulp-load-plugins')({
  rename: {
    'gulp-merge-media-queries': 'mmq'
  }
});
const	bsDev = require('browser-sync').create('dev');
const bsTest  = require('browser-sync').create('test');
const	del         = require('del');
const yargs       = require('yargs');
const config      = require('./gulpconfig.js');
const extend   = require('object-assign-deep');

// Metalsmith Plugins
// const ms = {
//   markdown:      require('metalsmith-markdown'),
//   layouts:       require('metalsmith-layouts'),
//   rename:        require('metalsmith-rename'),
//   writeMetadata: require('metalsmith-writemetadata')
// };
// const markdown = require('metalsmith-markdown');
// const layouts = require('metalsmith-layouts');
// const rename =
// const pug = require('pug');

const DEPLOY = Boolean(yargs.argv.production);
const FULLTEST = Boolean(yargs.argv.fulltest);
const TEST = Boolean(yargs.argv.test);

// export function site() {
//   return gulp.src('src/metalsmith/pages/**/*')
//   .pipe($.metalsmith({
//     metadata: {
//       site: {
//         title: 'Hello World'
//       }
//     },
//     frontmatter: true,
//     root:        './src/metalsmith',
//     use:         [
//
//       ms.markdown(),
//       ms.layouts({
//         engine:    'pug',
//         partials:  'partials',
//         directory: 'layouts',
//         pretty:    true,
//         rename:    true
//       }),
//       ms.writeMetadata({
//         pattern:        ['./src/metalsmith/**/*'],
//         ignorekeys:     ['next', 'previous'],
//         bufferencoding: 'utf8'
//       })
//     ]
//   }))
//   .pipe(gulp.dest('build'));
// }

export function jekyll(cb) {
  var spawn = require('child_process').spawn;
  // After build: cleanup HTML
  var options = {stdio: 'inherit', config: '"_config.yml,_config_dev.yml"'};
  // Run Jekyll build in production mode if --deploy flag is passed.
  if (DEPLOY) {
    var env = Object.create(process.env);
    env.JEKYLL_ENV = 'production';
    options.env = env;
  }
  var jekyll = spawn('jekyll', ['build', '--config', '_config.yml,_config_dev.yml'], options);
  // console.log(jekyll);
  jekyll.on('exit', function(code) {
    cb(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
  jekyll.on('error', function(e) {
    cb(e);
    // console.dir(e);
    this.emit('end');
  });
}

export function devServer(done) {
  bsDev.init(config.devServer);
  done();
}

export function testServer(done) {
  if (TEST || FULLTEST) {
    bsTest.init(config.testServer);
  }
  done();
}

export function reload(done) {
  if (FULLTEST) {
    bsDev.reload();
    bsTest.reload();
  } else if (TEST) {
    bsTest.reload();
  } else {
    bsDev.reload();
  }
  done();
}

export function clean() {
  return del('./build');
}

export function styles() {
  return gulp.src(config.scss.paths.src + '/*.scss')
	.pipe($.sourcemaps.init())
	.pipe($.sass(config.scss.options.sass).on('error', $.sass.logError))
  .pipe($.pixrem())
	.pipe($.autoprefixer({browsers: config.scss.compatability}))
  .pipe($.mmq(config.scss.options.mmq))
  .pipe($.if(DEPLOY, $.cssnano()))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest(config.scss.paths.build))
	.pipe(
    bsDev.stream({ // Inject Styles
      // Force source map exclusion.
      // *This fixes reloading issue on each file change*
      match: '**/*.css'
    })
  );
}

export function scripts() {
  return gulp.src(config.js.paths.partials)
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
	.pipe(gulp.dest(config.js.paths.build));
}

export function testScripts() {
  return gulp.src('test/scripts/*.js')
	.pipe($.sourcemaps.init())
	.pipe($.concat('tests.js'))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest('./test'));
}

export function images() {
  return gulp.src(config.images.paths.src)
  .pipe($.if(DEPLOY,
    $.imagemin(config.images.options)
  ))
  .pipe(gulp.dest(config.images.paths.build));
}

function parseObjectString(string, value) {
  let output = {};
  let previous;
  let chain = string.split('.');
  // If there's just one key, then keep it simple and return the output.
  // NOTE: This stops the doubling effect of `key: {key: {}}`
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

export function pensAPI() {
  // Use this to store the current file name
  let currentFile;
  return gulp.src('build/pens/**/*')
  // Rename the file and set `currentFile`
  .pipe($.rename(function(path) {
    path.basename = path.dirname;
    currentFile = path.basename;
  }))
  // Do the DOM stuff
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
    output[currentFile] = apiObject;
    return JSON.stringify(output, null, 2);
  }, false))
  // Change the extension to .json
  .pipe($.rename(function(path) {
    path.extname = '.json';
  }))
  // Merge stuff so there's just a single JSON file at the end
  .pipe($.mergeJson({
    fileName: 'pens-api.json'
  }))
  .pipe(gulp.dest('build/api'));
}

export function watch() {
  gulp.watch(`${config.scss.paths.src}/**/*.scss`, styles);
  gulp.watch(config.js.paths.src, gulp.series(scripts, reload));
  gulp.watch(config.images.paths.src, gulp.series(images, reload));
  if (FULLTEST || TEST) {
    gulp.watch('test/index.html', bsTest.reload());
    gulp.watch('./test/scripts/*.js', gulp.series(testScripts, reload));
  }
  if (FULLTEST || !TEST) {
    gulp.watch(
      ['./src/jekyll/**/*', '_config_dev.yml', 'config.yml'],
      gulp.series(jekyll, pensAPI, reload)
    );
  }
}

const dev = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    testScripts,
    images
  ),
  jekyll,
  pensAPI,
  gulp.parallel(devServer,
  testServer),
  watch
);

export {dev};

export default dev;
