import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';
import del from 'del';
// Tasks
import {startServers, reload, servers} from './gulp/tasks/server';
import {styles} from './gulp/tasks/styles';
import {scripts} from './gulp/tasks/scripts';
import {images} from './gulp/tasks/images';
import {tests} from './gulp/tasks/tests';
import {rootAssets} from './gulp/tasks/rootAssets';
import {getTreehouseJSON, generateSitemap, buildSite} from './gulp/tasks/pages';
import {buildAPI, removeAPIAttr} from './gulp/tasks/api';

import {
  DEPLOY,
  TEST,
  FULLTEST,
  DIR,
  STYLES,
  SCRIPTS,
  IMAGES,
  PAGES
} from './gulp/config';

// Servers
export {startServers, reload, servers};

// Styles
export {styles};

// Scripts
export {scripts};

// Images
export {images};

// Pages
export {getTreehouseJSON, generateSitemap, buildSite};

// API
export const generateAPI = gulp.series(buildAPI, removeAPIAttr);

export function clean() {
  if (DEPLOY) {
    return del(DIR.dist);
  }
  return del(DIR.build);
}

// Deploy
export function deploy() {
  return gulp.src(`${DIR.dist}/**/*`).pipe(ghPages());
}

// Watch
export function watch() {
  gulp.watch(`${STYLES.PATH.src}/**/*.scss`, styles);
  gulp.watch(`${SCRIPTS.PATH.src}/**/*.js`, gulp.series(scripts, reload));
  gulp.watch(`${IMAGES.PATH.src}/**/*`, gulp.series(images, reload));
  gulp.watch(`./src/root/**/*`, gulp.series(rootAssets, reload));
  if (FULLTEST || TEST) {
    gulp.watch('test/index.html', servers.test.reload());
    gulp.watch('./test/scripts/*.js', gulp.series(tests, reload));
  }
  if (FULLTEST || !TEST) {
    gulp.watch(
      [`${DIR.src}/${PAGES.templates}/**/*`, './config.yml'],
      gulp.series(buildSite, generateAPI, reload)
    );
  }
}

// Default
const start = gulp.series(
  clean,
  getTreehouseJSON,
  TEST ?
    FULLTEST ?
      gulp.parallel(styles, scripts, tests, images) :
      gulp.parallel(styles, scripts, tests) :
    gulp.parallel(styles, scripts, images),
  DEPLOY ?
    gulp.series(buildSite, generateAPI, generateSitemap) :
    TEST ?
      gulp.series(startServers, watch) :
      gulp.series(buildSite, generateAPI, startServers, watch)
);

export {start};
export default start;
