import gulp from 'gulp';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';

import {DEPLOY, IMAGES} from '../config';

const {PATH, OPTIONS} = IMAGES;

export function images() {
  return gulp
    .src(`${PATH.src}/**/*`)
    .pipe(gulpIf(DEPLOY, imagemin(OPTIONS)))
    .pipe(
      gulpIf(
        DEPLOY,
        gulp.dest(PATH.dist),
        gulp.dest(PATH.build)
      )
    );
}
