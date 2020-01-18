import gulp from 'gulp';
import rename from 'gulp-rename';
import dom from 'gulp-dom';
import mergeJson from 'gulp-merge-json';
import gulpIf from 'gulp-if';
import yargs from 'yargs';

import {DIR} from '../config';
import {stringChainToObject} from '../utils';

const DEPLOY = Boolean(yargs.argv.production);

//
// API
// ================= //

export function buildAPI() {
  let currentFile;
  let namespace;
  const src = DEPLOY ? DIR.dist : DIR.build;
  return gulp
    .src(`${src}/**/*.html`)
    .pipe(
      rename(function(path) {
        // console.log(path);
        // If string contains '/': parse and pull the last value
        if (path.dirname.indexOf('/') > -1) {
          const arrayFromDirname = path.dirname.split('/');
          // console.log(arrayFromDirname);
          // get indexes for object keys
          const namespaceIndex = arrayFromDirname.length - 2;
          const lastIndex = arrayFromDirname.length - 1;
          // set file and key
          path.basename = arrayFromDirname[lastIndex];
          // set namesapce key
          namespace = arrayFromDirname[namespaceIndex];
        } else {
          // make namespace false if there isnt one available
          namespace = -1;
          // Try to remember why I did this...
          path.basename = path.dirname;
        }
        currentFile = path.basename;
      })
    )
    .pipe(
      dom(function() {
        const output = {};
        const blocks = this.querySelectorAll('[build-api]');
        let objectChainString;
        let apiObject;

        for (let i = 0; i < blocks.length; i++) {
          objectChainString = blocks[i].getAttribute('build-api');
          apiObject = Object.assign(
            {},
            stringChainToObject(objectChainString, blocks[i].innerHTML)
          );
        }
        // handle namespacing
        if (namespace === -1) {
          output[currentFile] = apiObject;
        }
        if (namespace !== -1) {
          if (!output[namespace]) {
            output[namespace] = {};
          }
          output[namespace][currentFile] = apiObject;
        }
        return JSON.stringify(output, null, 2);
      }, false)
    )
    .pipe(
      rename(function(path) {
        path.extname = '.json';
      })
    )
    .pipe(
      mergeJson({
        fileName: 'api.json'
      })
    )
    .pipe(
      gulpIf(
        DEPLOY,
        gulp.dest(`${DIR.dist}/api`),
        gulp.dest(`${DIR.build}/api`)
      )
    );
}

export function removeAPIAttr() {
  const src = DEPLOY ? DIR.dist : DIR.build;
  return gulp
    .src(`${src}/**/*.html`)
    .pipe(
      dom(function() {
        const elements = this.querySelectorAll('[build-api]');

        for (let i = 0; i < elements.length; i++) {
          elements[i].removeAttribute('build-api');
        }
        return this;
      })
    )
    .pipe(
      gulpIf(
        DEPLOY,
        gulp.dest(DIR.dist),
        gulp.dest(DIR.build)
      )
    );
}
