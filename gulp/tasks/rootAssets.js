import gulp from 'gulp';
import gulpIf from 'gulp-if';

import {DEPLOY, DIR} from '../config';

export function rootAssets() {
  return gulp
    .src(`${DIR.src}/root/**/*`)
    .pipe(gulp.dest(gulpIf(DEPLOY, DIR.dist, DIR.build)));
}
