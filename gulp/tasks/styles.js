import gulp from 'gulp';
import sass from 'gulp-sass';
import pixrem from 'gulp-pixrem';
import autoprefixer from 'gulp-autoprefixer';
import mmq from 'gulp-merge-media-queries';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
import yargs from 'yargs';

import {STYLES} from '../config';

const DEPLOY = Boolean(yargs.argv.production);

const {PATH, OPTIONS} = STYLES;

export function styles() {
  return gulp
    .src(`${PATH.src}/*.scss`, {sourcemaps: true})
    .pipe(sass(OPTIONS.sass))
    .pipe(pixrem())
    .pipe(autoprefixer())
    .pipe(mmq(OPTIONS.mmq))
    .pipe(gulpIf(DEPLOY, cssnano()))
    .pipe(gulpIf(
      DEPLOY,
      rename(function(path) {
        path.basename = `${path.basename}.min`;
      })
    ))
    .pipe(
      gulp.dest(
        gulpIf(DEPLOY, PATH.dist, PATH.build),
        {sourcemaps: true}
      )
    );
}
