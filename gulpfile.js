'use strict';

var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({
  rename: {
    'gulp-merge-media-queries': 'mmq'
  }
});
var	browserSync = require('browser-sync').create();
var	sequence    = require('run-sequence');
var	del         = require('del');
var yargs       = require('yargs');
// var cleanStack  = require('clean-stack');
var config      = require('./gulpconfig.js');

var DEPLOY = Boolean(yargs.argv.production);

// function cleanUpStackTrace(e) {
//   return e.toString().split(/[\r\n]+/).filter(line => !line.match(/^\s+at Parser/)).join(os.EOL);
// }

/* browserSync */
gulp.task('browserSync', function() {
  return browserSync.init(config.browserSync);
});

/* Clean */
gulp.task('clean', function() {
  return del(['./_site/assets']);
});

/* Images */
gulp.task('images', function() {
  return gulp.src(config.images.paths.src)
  .pipe($.if(DEPLOY,
    $.imagemin(config.images.options)
  ))
  .pipe(gulp.dest(config.images.paths.build));
});

/* Compile SCSS */
gulp.task('scss', function() {
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
    browserSync.stream({ // Inject Styles
      // Force source map exclusion.
      // *This fixes reloading issue on each file change*
      match: '**/*.css'
    })
  );
});

/* Copy Over jQuery */
gulp.task('jquery', function() {
  return gulp.src(config.jquery.paths.src)
  .pipe(gulp.dest(config.jquery.paths.build));
});

/* Concatinate Main JS Files */
gulp.task('scripts', function() {
  return gulp.src(config.js.paths.partials)
	.pipe($.sourcemaps.init())
  .pipe($.babel())
  .on('error', function(e) {
    // e.showStack = false;
    // console.dir(e);
    console.error('\x1b[31m%s\x1b[0m', e.message);
    console.log(e.codeFrame);
    this.emit('end');
  })
	.pipe($.concat('app.js'))
  .pipe($.if(DEPLOY, $.uglify()))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest(config.js.paths.build));
});

/**
 * Jekyll Task
 *
 * Make Jekyll run stuff when told to by gulp.
 *
 * The result of this task is a CLI input based on if the '--production' flag exists.
 *
 * If `--production` argument is passed, then the output to the Jekyll will be:
 *
 * 'JEKYLL_ENV=production jekyll build'
 *
 * Else it will be:
 *
 * 'jekyll build'
 *
 * @see https://nodejs.org/api/child_process.htm
 */
gulp.task('jekyll', function(cb) {
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
    // cb(e);
    // console.dir(e);
    this.emit('end');
  });
});



/**
 * Reloading Tasks
 */

// BrowserSync
gulp.task('browserSyncReload', function(done) {
  browserSync.reload();
  done();
});

// JavaScript
gulp.task('scriptsReload', function(cb) {
  sequence(
    'scripts',
    // 'jekyll',
    'browserSyncReload',
    cb
  );
});
//
gulp.task('scriptsReload', function(cb) {
  sequence(
    'scripts',
    // 'jekyll',
    'browserSyncReload',
    cb
  );
});

// Images
gulp.task('imagesReload', function(cb) {
  sequence(
    'images',
    // 'jekyll',
    'browserSyncReload',
    cb
  );
});

// Jekyll
gulp.task('jekyllReload', function(cb) {
  sequence(
    'jekyll',
    'browserSyncReload',
    cb
  );
});

/**
 * Watch Task
 */
gulp.task('watch', function() {
  // Watch SCSS
  gulp.watch(config.scss.paths.src + '/**/*.scss', ['scss']);
  // Watch JS
  gulp.watch(config.js.paths.src, ['scriptsReload']);
  // Watch HTML
  gulp.watch(
    [
      // '_includes/**/*',
      // '_layouts/**/*',
      // '_posts/*',
      // '_projects/*',
      // '_styleguide/**/*',
      '*.html',
      './*.md',
      './_config.yml',
      '_*/**/*',
      '!_src/**/*',
      '!_site/**/*'
    ],
    ['jekyllReload']
  ).on('error', function(e) {
    console.log(e);
  });
  // Watch Images
  gulp.watch(config.images.paths.src, ['imagesReload']);
  // Watch Test Files
  gulp.watch('./test/**/*', ['browserSyncReload']);
});

gulp.task('default', function(cb) {
  sequence(
    'clean',
    ['scss', 'jquery', 'scripts', 'images'],
    'jekyll',
    'browserSync',
    'watch',
    cb
  );
});

/**
 * Test Tasks
 */

gulp.task('testClean', function() {
  return del(['./test/lib', './test/assets']);
});

gulp.task('testServer', function() {
  return browserSync.init(config.testServer);
});

gulp.task('testLib', function() {
  return gulp.src([
    './node_modules/mocha/mocha.js',
    './node_modules/mocha/mocha.css',
    './node_modules/chai/chai.js',
    './node_modules/chai-jquery/chai-jquery.js',
    './bower_components/jquery/dist/jquery.slim.js'
  ])
  .pipe(gulp.dest('./test/lib'));
});

gulp.task('testAssets', function() {
  return gulp.src(config.js.paths.partials)
	.pipe($.sourcemaps.init())
  .pipe($.babel())
  .on('error', function(e) {
    console.error('\x1b[31m%s\x1b[0m', e.message);
    console.log(e.codeFrame);
    this.emit('end');
  })
	.pipe($.concat('gingabulous.js'))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest('./test/assets'));
});

gulp.task('testScripts', function() {
  return gulp.src('test/scripts/*.js')
	.pipe($.sourcemaps.init())
	.pipe($.concat('tests.js'))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest('./test/assets'));
});

gulp.task('watchTestServer', function() {
  gulp.watch(['./test/index.html', '!./test/*.js'], ['browserSyncReload']);
  gulp.watch('./test/scripts/*.js', function(cb) {
    sequence(
      'unitTests',
      'browserSyncReload',
      cb
    );
  });
  gulp.watch(config.js.paths.src, function(cb) {
    sequence(
      'testScripts',
      'browserSyncReload',
      cb
    );
  });
});

gulp.task('test', function(cb) {
  sequence(
    'testClean',
    'testAssets',
    'testLib',
    'testScripts',
    'testServer',
    'watchTestServer',
    cb
  );
});
