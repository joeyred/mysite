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

// Metalsmith Plugins
const ms = {
  markdown:      require('metalsmith-markdown'),
  layouts:       require('metalsmith-layouts'),
  rename:        require('metalsmith-rename'),
  writeMetadata: require('metalsmith-writemetadata')
};
// const markdown = require('metalsmith-markdown');
// const layouts = require('metalsmith-layouts');
// const rename =
// const pug = require('pug');

const DEPLOY = Boolean(yargs.argv.production);
const FULLTEST = Boolean(yargs.argv.fulltest);
const TEST = Boolean(yargs.argv.test);

export function site() {
  return gulp.src('src/metalsmith/pages/**/*')
  .pipe($.metalsmith({
    metadata: {
      site: {
        title: 'Hello World'
      }
    },
    frontmatter: true,
    root:        './src/metalsmith',
    use:         [

      ms.markdown(),
      ms.layouts({
        engine:    'pug',
        partials:  'partials',
        directory: 'layouts',
        pretty:    true,
        rename:    true
      }),
      ms.writeMetadata({
        pattern:        ['./src/metalsmith/**/*'],
        ignorekeys:     ['next', 'previous'],
        bufferencoding: 'utf8'
      })
    ]
  }))
  .pipe(gulp.dest('build'));
}

export function devServer() {
  return bsDev.init(config.devServer);
}

export function testServer() {
  return bsTest.init(config.testServer);
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

export function watch() {
  gulp.watch(`${config.scss.paths.src}/**/*.scss`, styles);
  gulp.watch(config.js.paths.src, gulp.series(scripts, reload));
  gulp.watch(config.images.paths.src, gulp.series(images, bsDev.reload()));
}

const dev = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    testScripts,
    images
  ),
  // metalsmith,
  devServer,
  testServer,
  watch
);

export {dev};

export default dev;
