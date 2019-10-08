import metalsmith from 'metalsmith';
// import pug from 'metalsmith-pug';
import permalinks from 'metalsmith-permalinks';
import collection from 'metalsmith-collections';
import collectionMetadata from 'metalsmith-collection-metadata';
// import branch from 'metalsmith-branch';
import prism from 'metalsmith-prism';
// import each from 'metalsmith-each';
// import debugUI from 'metalsmith-debug-ui';

import gingabulousLayouts from '../plugins/metalsmith-gingabulous-pug';

function runMetalsmith(config, done) {
  const {
    metadata,
    workingDir,
    src,
    dest,
    collections,
    pugOptions
  } = config;
  // debug(config);
  // console.log(config);
  metalsmith(workingDir)
    .metadata(metadata)
    .source(src)
    .destination(dest)
    .clean(false)
    .use(collection(collections.defined))
    .use(collectionMetadata(collections.defaults))
    .use(gingabulousLayouts(pugOptions))
    .use(
      prism({
        preLoad: ['markup-templating', 'clike', 'markup']
      })
    )
    // .use(permalinks({
    //   unique: true
    // }))
    .use(permalinks())
    .build(function(error) {
      if (error) {
        done();
        console.log(error);
        throw error;
      }
      done();
    });
}

export default runMetalsmith;
