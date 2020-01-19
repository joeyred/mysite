import metalsmith from 'metalsmith';
// import pug from 'metalsmith-pug';
import permalinks from 'metalsmith-permalinks';
import collection from 'metalsmith-collections';
import collectionMetadata from 'metalsmith-collection-metadata';
// import branch from 'metalsmith-branch';
import prism from 'metalsmith-prism';
import ignore from 'metalsmith-ignore';
// import each from 'metalsmith-each';
// import debugUI from 'metalsmith-debug-ui';

import gingabulousLayouts from '../plugins/metalsmith-gingabulous-pug';

// QUESTION Do I still need to solve any precompiling issues for markdown
// in metadata, or pug for that matter? (style guide stuff).

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
    // This needs to replace the old del task for collections that aren't
    // outputted
    .use(ignore())
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
        // Do I really want to throw an error, or just report it to console
        // and continue running gulp?
        // throw error;
      }
      done();
    });
}

export default runMetalsmith;
