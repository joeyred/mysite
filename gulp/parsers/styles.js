// assets:
//   # whether to use an /assets/ sub directory
//   sub_dir: true
//   # Styles
//   styles:
//     destination: css
//     compatability:
//       - last 2 versions
//       - ie >= 9
//       - safari 8
//     include_directories:
//       - base
//       - components
//       - ui-modules
//       - pages
//       - projects

import {
  AssetConfigParser,
  handleRelativePaths,
  getValue
} from '../utils';

const DEFAULTS = {
  source:        'scss',
  destination:   'css',
  sub_dir:       false, // eslint-disable-line camelcase
  compatability: ['last 2 versions', 'ie >= 9', 'safari 8'],
  logs:          false,
  percision:     10
};

function parseOptions(options, paths) {
  const {compatability, logs, percision} = options;
  const {dir} = paths;
  const includeDirectories = getValue([], options.include_directories);

  return {
    sass: {
      includePaths: handleRelativePaths(`${paths.src}/${dir.src}`, includeDirectories),
      percision
    },
    browsers: compatability,
    mmq:      {
      logs
    }
  };
}

export default function parse(paths, config) {
  const options = Object.assign({}, DEFAULTS, config);

  return new AssetConfigParser(paths, options, {getOptions: parseOptions}).output();
}
