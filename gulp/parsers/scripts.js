// scripts:
//   partials:
//     - modules/core.js
//     - modules/util.*.js
//     - '**/!(app).js'
//     - app.js
//   test:
//     partials:
//       - modules/core.js
//       - modules/util.*.js
//       - modules/**.js

import {
  AssetConfigParser,
  handleRelativePaths,
  getValue
} from '../utils';

const DEFAULTS = {
  source:      'js',
  destination: 'js',
  sub_dir:     false, // eslint-disable-line camelcase
  filename:    'app'
};

function parseOptions(options, paths) {
  // console.log(options, paths);
  const {filename} = options;
  const {dir} = paths;
  const partials = getValue([`${dir.src}/*.js`], options.partials);
  let glob;
  if (partials.length <= 1) {
    glob = partials[0];
  } else {
    glob = handleRelativePaths(
      `${paths.src}/${dir.src}`,
      [
        ...partials,
        `**/!(${filename}).js`,
        `${filename}.js`
      ]
    );
    // glob = [
    //   ...partials,
    //   `**/!(${filename}).js`,
    //   `${filename}.js`
    // ];
  }

  return {
    filename,
    globPattern: glob
  };
}

export default function parse(paths, config) {
  const options = Object.assign({}, DEFAULTS, config);

  return new AssetConfigParser(paths, options, {getOptions: parseOptions}).output();
}
