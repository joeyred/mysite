import fs from 'fs';
import gulp from 'gulp';
import remoteSrc from 'gulp-remote-src';
import rename from 'gulp-rename';
import sitemap from 'gulp-sitemap';
// import yargs from 'yargs';
import _ from 'lodash';

import {
  url,
  generateNavObject
} from './helpers';
import runMetalsmith from '../runMetalsmith';
import {loadData} from '../../utils';
import {DEPLOY, DIR, PAGES, COLLECTIONS} from '../../config';

// const DEPLOY = Boolean(yargs.argv.production);

const transformers = {
  markdown: require('jstransformer-markdown-it')
};

const filters = {
  markdown: function(block) {
    return filters.markdown.render(block, {html: true});
  }
};

function getContent(files) {
  const output = {};
  for (let i = 0; i < files.length; i++) {
    output[files[i]] = loadData(`${DIR.src}/${PAGES.data}/${files[i]}`);
  }
  return output;
}

export function getTreehouseJSON(done) {
  let file = false;
  try {
    file = fs.statSync('./src/content/treehouse.json');
  } catch (error) {
    console.log('File does not exist. Downloading file from remote source');
  }
  if (file && !DEPLOY) {
    return done();
  }
  return remoteSrc(
    'brianhayes.json',
    {
      base: 'https://teamtreehouse.com/'
    }
  )
    .pipe(rename(function(path) {
      path.basename = 'treehouse';
    }))
    .pipe(gulp.dest(`${DIR.src}/${PAGES.data}/`)
    );
}

export function generateSitemap() {
  return gulp
    .src(`${DIR.dist}/**/*.html`, {read: false})
    .pipe(
      sitemap({
        siteUrl: PAGES.url
      })
    )
    .pipe(gulp.dest(DIR.dist));
}

export function buildSite(done) {
  const siteData = getContent(PAGES.data_files);
  const internalLink = url(DEPLOY, PAGES.url);
  const msOptions = {
    metadata: {
      build:   {production: DEPLOY},
      site:    PAGES.url,
      data:    siteData,
      _,
      // NOTE For backwards compatability. Use `transformers` instead.
      filters: transformers,
      transformers,
      helpers: {
        // NOTE For backwards compatability. Use `internalLink` instead.
        url: internalLink,
        internalLink,
        generateNavObject
      }
    },
    workingDir:  process.cwd(),
    src:         `${DIR.src}/${PAGES.templates}/pages`,
    dest:        DEPLOY ? DIR.dist : DIR.build,
    collections: COLLECTIONS,
    pugOptions:  {
      filters
    }
  };
  runMetalsmith(msOptions, done);
}
