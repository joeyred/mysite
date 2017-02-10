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
var config      = require('./gulpconfig.js');

var DEPLOY = Boolean(yargs.argv.production);

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
  return gulp.src()
	.pipe($.sourcemaps.init())
	.pipe($.sass(config.scss.options.sass).on('error', $.sass.logError))
	.pipe($.mmq(config.scss.options.mmq))
	.pipe($.autoprefixer({browsers: config.scss.compatability}))
  .pipe($.pixrem())
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
  var options = {stdio: 'inherit'};
  // Run Jekyll build in production mode if --deploy flag is passed.
  if (DEPLOY) {
    var env = Object.create(process.env);
    env.JEKYLL_ENV = 'production';
    options.env = env;
  }
  var jekyll = spawn('jekyll', ['build'], options);

  jekyll.on('exit', function(code) {
    cb(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
});
