import gulp from 'gulp';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';
import yargs from 'yargs';

import {SCRIPTS} from '../config';

const DEPLOY = Boolean(yargs.argv.production);

const {PATH, OPTIONS} = SCRIPTS;

//
// Scripts
// ================= //
export function scripts() {
  return gulp
    .src(OPTIONS.globPattern, {sourcemaps: true})
    .pipe(babel())
    .on('error', function(e) {
      console.error('\x1b[31m%s\x1b[0m', e.message);
      console.log(e.codeFrame);
      this.emit('end');
    })
    .pipe(gulpIf(DEPLOY,
      concat(`${OPTIONS.filename}.min.js`),
      concat(`${OPTIONS.filename}.js`))
    )
    .pipe(gulpIf(DEPLOY, uglify()))
    .pipe(
      gulp.dest(
        gulpIf(DEPLOY, PATH.dist, PATH.build),
        {sourcemaps: true}
      )
    );
}
// NOTE nonconfigurable for now
export function testScripts() {
  return gulp
    .src('test/scripts/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('tests.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./test'));
}
