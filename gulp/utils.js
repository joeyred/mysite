// node.js stuff
import path from 'path';
import fs from 'fs';
// lodash
import replace from 'lodash/replace';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
// gulp stuff
import {dest} from 'gulp';
import remoteSrc from 'gulp-remote-src';
// misc utilities
import yaml from 'js-yaml';

function splitURL(url) {
  const urlArray = url.split('/');
  const filename = urlArray[urlArray.length - 1];
  const base = replace(url, filename, '');

  return {
    filename,
    base
  };
}

function addSlash(string, starts = true) {
  if (starts) {
    return `/${string}`;
  }
  return `${string}/`;
}

function removeSlash(string, starts = true) {
  if (starts) {
    return string.slice(0, 0);
  }
  return string.slice(0, -1);
}

function startsEndsWith(starts = true) {
  if (starts) {
    return startsWith;
  }
  return endsWith;
}

// function addRemoveSlash(add = true) {
//   if (add) {
//     return addSlash;
//   }
//   return removeSlash;
// }

function checkForSlash(string, starts = true) {
  const check = startsEndsWith(starts);
  return check(string, '/');
}

function handleSlash(string, starts = true, forceSlash = true) {
  if (checkForSlash(string, starts)) {
    if (forceSlash) {
      // slash exists, so there's no need to add anything
      return string;
    }
    // removes slash
    return removeSlash(string, starts);
  }
  if (forceSlash) {
    return addSlash(string, starts);
  }
  return string;
}

export function getDirPath(defaultDirName, dirName, parentDirName = false) {
  if (parentDirName) {
    return Boolean(dirName) ?
      `${parentDirName}/${dirName}` :
      `${parentDirName}/${defaultDirName}`
    ;
  }
  return Boolean(dirName) ? `./${dirName}` : defaultDirName;
}

export function getValue(defaultValue, value) {
  return Boolean(value) ? value : defaultValue;
}

export function handleAssetPathOption(useAssetDir, customDirName = false) {
  const assetDirName = customDirName ? customDirName : 'assets';
  if (useAssetDir) {
    return function(defaultDirName, dirName, parentDirName) {
      return Boolean(dirName) ?
        `${parentDirName}/${assetDirName}/${dirName}` :
        `${parentDirName}/${assetDirName}/${defaultDirName}`
      ;
    };
  }
  return function(defaultDirName, dirName, parentDirName) {
    return Boolean(dirName) ?
      `${parentDirName}/${dirName}` :
      `${parentDirName}/${defaultDirName}`
    ;
  };
}

export function handleRelativePaths(base, paths) {
  const output = [];

  for (let i = 0; i < paths.length; i++) {
    output.push(`${base}/${paths[i]}`);
  }
  return output;
}

export function getFileExtension(filepath) {
  const filepathArray = filepath.split('.');
  const extensionIndex = filepathArray[filepathArray.length - 1];
  return filepathArray[extensionIndex];
}

export function loadYmlData(filepath) {
  const file = fs.readFileSync(filepath, 'utf8');
  return yaml.load(file);
}

export function loadJSONData(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

export function loadData(filepath) {
  const file = fs.readFileSync(filepath, 'utf8');
  const ext = path.extname(filepath);
  // deal with a YAML file
  if (ext === '.yaml' || ext === '.yml') {
    return yaml.load(file);
  }
  // deal with a JSON file
  if (ext === '.json') {
    return JSON.parse(file);
  }
  // make an error do its thing if the incorrect filetype is passed.
  return new Error('Exception: File must have a .json .yml or .yaml extension');
}

export function getRemoteData(url, destination, deploy, done) {
  const {filename, base} = splitURL(url);
  const filepath = `${handleSlash(destination, false)}${filename}`;

  const file = fs.statSync(filepath);

  if (file && !deploy) {
    return done();
  }
  return remoteSrc(filename, {
    base
  }).pipe(dest(destination));
}

export function findMatch(array, stringToMatch) {
  for (let i = 0; array.length > i; i++) {
    if (array[i] === stringToMatch) {
      return true;
    }
  }
  return false;
}

/**
 * Create a new object populated with specifc keys from another object.
 * @method specificKeysToNewObject
 * @param  {Object}                object - The original object.
 * @param  {String[]}                keys - The strings to populate the new
 *                                          object with.
 * @return {Object|Boolean}               - The new object with only the passed
 *                                          keys in it. If none of the keys
 *                                          passed match any of the keys in the
 *                                          original object, returns `false`.
 */
export function specificKeysToNewObject(object, keys) {
  const output = {};
  const objectKeys = Object.keys(object);
  let noMatchFound = true;

  for (let i = 0; keys.length > i; i++) {
    if (findMatch(objectKeys, keys[i])) {
      output[keys[i]] = object[keys[i]];
      noMatchFound = false;
    }
  }
  if (noMatchFound) {
    return false;
  }
  return output;
}

export function splitObjectByKeys(object, keys) {
  const objectSplitTo = {};
  const objectSplitFrom = {};
  const objectKeys = Object.keys(object);
  // console.log(objectKeys);

  for (let i = 0; objectKeys.length > i; i++) {
    if (findMatch(keys, objectKeys[i])) {
      objectSplitTo[objectKeys[i]] = object[objectKeys[i]];
    } else {
      objectSplitFrom[objectKeys[i]] = object[objectKeys[i]];
    }
  }

  return {
    splitTo: {
      ...objectSplitTo
    },
    splitFrom: {
      ...objectSplitFrom
    }
  };
}

export function addGlobalsToModules(object, globalsToAdd, keysOfModules) {
  const output = {};
  const objectOfGlobals = specificKeysToNewObject(object, globalsToAdd);
  const objectOfModules = specificKeysToNewObject(object, keysOfModules);

  for (let module in objectOfModules) {
    if (Object.prototype.hasOwnProperty.call(objectOfModules, module)) {
      output[module] = Object.assign(
        {}, objectOfModules[module], objectOfGlobals
      );
    }
  }
  // console.log(output);
  return output;
}

/**
 * Takes a string representation of an object chain and creates a real object
 * path with it, including value.
 *
 * @method stringChainToObject
 * @param  {String}            string - The string representation of the chain.
 * @param  {*}                 value  - The value to be kept in the location
 *                                      represented.
 * @return {object}                   - The object for use in API building
 */
export function stringChainToObject(string, value) {
  const output = {};
  const chain = string.split('.');
  let previous;
  // If there's just one key, then keep it simple and return the output.
  /** NOTE This stops the doubling effect of `key: {key: {}}` */
  if (chain.length === 1) {
    output[chain[0]] = value;
    return output;
  }
  for (let i = 0; i < chain.length; i++) {
    // First key
    if (i === 0) {
      output[chain[i]] = {};
      previous = output[chain[i]];
    }
    // All keys between first & last
    if (i !== 0 && i + 1 !== chain.length) {
      previous[chain[i]] = {};
      previous = previous[chain[i]];
    }
    // Last key
    if (i + 1 === chain.length) {
      previous[chain[i]] = value;
    }
  }
  return output;
}

class ConfigParser {
  constructor(paths, config, handlers) {
    const {src, build, dist} = paths;
    const splitConfig = splitObjectByKeys(config, ['source', 'destination']);
    const dir = splitConfig.splitTo;
    const options = splitConfig.splitFrom;
    this.paths = {
      ...paths,
      dir: {
        src:  dir.source,
        dest: dir.destination
      }
    };
    this.src = src;
    this.build = build;
    this.dist = dist;
    this.dir = {
      src:  dir.source,
      dest: dir.destination
    };
    this.handlers = handlers || {};
    this.options = options || {};
  }

  handlePath(base, dir) {
    const {getPath} = this.handlers;
    if (getPath) {
      return getPath(base, dir);
    }
    return `${base}/${dir}`;
  }
  handleSrcPath(base, dir) {
    return this.handlePath(base, dir);
  }
  handleDestPath(base, dir) {
    return this.handlePath(base, dir);
  }

  handleOptions() {
    const {getOptions} = this.handlers;

    if (getOptions) {
      return getOptions(this.options, this.paths);
    }

    return {
      ...this.options
    };
  }

  output() {
    const {src, dest} = this.dir;
    // console.log(src, dest);
    // console.log({
    //   PATH: {
    //     src:   this.handleSrcPath(this.src, src),
    //     build: this.handleDestPath(this.build, dest),
    //     dist:  this.handleDestPath(this.dist, dest)
    //   },
    //   OPTIONS: this.handleOptions()
    // });
    return {
      PATH: {
        src:   this.handleSrcPath(this.src, src),
        build: this.handleDestPath(this.build, dest),
        dist:  this.handleDestPath(this.dist, dest)
      },
      OPTIONS: this.handleOptions()
    };
  }
}

export class AssetConfigParser extends ConfigParser {
  handleDestPath(base, dir) {
    // eslint-disable-next-line camelcase
    const {sub_dir} = this.options;

    // eslint-disable-next-line camelcase
    return sub_dir ? `${base}/assets/${dir}` : `${base}/${dir}`;
  }
}
