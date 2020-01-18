// title: Brian Hayes
// description: >
//   The personal professional website and portfolio for Brian Hayes.
// url: https://www.brianhayes.me
// email: bjoeyhayes@gmail.com
// social:
//   twitter: https://twitter.com/BJoeyHayes
//   linkedin: https://www.linkedin.com/in/bjoeyhayes/
//   github: https://github.com/joeyred
//   codepen: https://codepen.io/joeyred/
//   stackoverflow: https://stackoverflow.com/users/5331958/joeyred

import {specificKeysToNewObject} from '../utils';

const DEFAULTS = {
  title:       'Gingabulous',
  description: 'A site built with Gulp, Metalsmith, and Gingabulousness',
  url:         'https://www.please-change-me.com',
  email:       'example@gmail.com',
  social:      {
    twitter:       'https://twitter.com/example',
    linkedin:      'https://www.linkedin.com/in/bjoeyhayes/',
    github:        'https://github.com/joeyred',
    codepen:       'https://codepen.io/joeyred/',
    stackoverflow: 'https://stackoverflow.com/users/5331958/joeyred'
  },
  templates:  'templates',
  data:       'data',
  // eslint-disable-next-line camelcase
  data_files: []
};

export default function parse(config) {
  return Object.assign(
    {},
    DEFAULTS,
    specificKeysToNewObject(
      config,
      [
        'title',
        'description',
        'url',
        'email',
        'social',
        'templates',
        'data',
        'data_files'
      ]
    )
  );
}
