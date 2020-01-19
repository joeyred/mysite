import yaml from 'js-yaml';
import fs from 'fs';

import parseCollections from './parsers/collections';
import parseStyles from './parsers/styles';
import parseScripts from './parsers/scripts';
import parseImages from './parsers/images';
import parseServers from './parsers/servers';
import parsePages from './parsers/pages';

import yargs from 'yargs';

import {
  // getValue,
  getDirPath,
  // handleAssetPathOption,
  addGlobalsToModules
  // ConfigParser
} from './utils';

const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

const {
  servers,
  collections,
  assets
} = config;

const {
  images,
  styles,
  scripts
} = addGlobalsToModules(assets, ['sub_dir'], ['styles', 'scripts', 'images']);

// const getAssetDirPath = handleAssetPathOption(assets.sub_dir);

//
// Export all CLI flags
// ================= //
export const DEPLOY = Boolean(yargs.argv.production);
export const FULLTEST = Boolean(yargs.argv.fulltest);
export const TEST = Boolean(yargs.argv.test);
export const DEBUG = Boolean(yargs.argv['debug-mode']);

/**
 * First level directory paths.
 * @type {Object}
 */
export const DIR = {
  src:   getDirPath('./src', config.source),
  build: getDirPath('./build', config.destination),
  dist:  getDirPath('./dist', config.deploy),
  test:  getDirPath('./test', config.test),
  node:  getDirPath('./node_modules', config.node),
  bower: getDirPath('./bower_components', config.bower)
};

export const STYLES = parseStyles(DIR, styles);
export const SCRIPTS = parseScripts(DIR, scripts);
export const IMAGES = parseImages(DIR, images);
export const SERVERS = parseServers(DIR, servers);
export const PAGES = parsePages(config);

/**
 * Fully parsed and ready to use collections object. For use with metalsmith
 * directly.
 * @type {Object}
 */
export const COLLECTIONS = parseCollections(collections);
