// collections:
//   # Pens
//   pens:
//     output: true
//     defaults:
//       type: 'pen'
//       api:
//         namespace: 'pens'
//   # Projects
//   projects:
//     output: true
//     defaults:
//       type: 'project'
//       api:
//         namespace: 'projects'
//   # Styleguide
//   styleguide:
//     precompile: true
//   # Documentation
//   docs:
//     output: true
//     defaults:
//       type: 'doc'
//       api:
//         namespace: 'docs'

function parseCollectionData(key, options) {
  const {defaults} = options || {};
  const {api} = defaults || {};
  return {
    pattern:    `${key}/**/*`,
    output:     true,
    precompile: false,
    ...options,
    defaults:   {
      type: `${key}`,
      ...defaults,
      api:  {
        namespace: `${key}`,
        ...api
      }
    }
  };
}

export default function parseCollections(collections) {
  const keys = Object.keys(collections);
  const defined = {};
  const defaults = {};
  const ignore = [];
  const precompile = [];

  let collection;

  for (let i = 0; keys.length > i; i++) {
    collection = parseCollectionData(keys[i], collections[keys[i]]);

    defined[keys[i]] = {
      pattern: collection.pattern
    };

    defaults[`collections.${keys[i]}`] = {
      ...collection.defaults
    };

    if (!collection.output) {
      ignore.push(collection.pattern);
    }

    if (collection.precompile) {
      precompile.push(collection.pattern);
    }
  }

  // console.log({
  //   defined,
  //   defaults,
  //   ignore,
  //   precompile
  // });

  return {
    defined,
    defaults,
    ignore,
    precompile
  };
}
