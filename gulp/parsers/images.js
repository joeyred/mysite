import {AssetConfigParser} from '../utils';

const DEFAULTS = {
  source:            'imgs',
  destination:       'imgs',
  optimizationLevel: 7,
  progressive:       true,
  interlaced:        true,
  multipass:         true
};

export default function parse(paths, config) {
  const options = Object.assign({}, DEFAULTS, config);

  return new AssetConfigParser(paths, options).output();
}
