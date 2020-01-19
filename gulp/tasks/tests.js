import gulp from 'gulp';
import concat from 'gulp-concat';

export function tests() {
  return gulp
    .src('test/scripts/*.js', {sourcemaps: true})
    .pipe(concat('tests.js'))
    .pipe(gulp.dest('./test'), {sourcemaps: true});
}
