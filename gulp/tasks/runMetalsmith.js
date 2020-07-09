import metalsmith from 'metalsmith';
import branch from 'metalsmith-branch';
import permalinks from 'metalsmith-permalinks';
import collection from 'metalsmith-collections';
import collectionMetadata from 'metalsmith-collection-metadata';
import prism from 'metalsmith-prism';
import ignore from 'metalsmith-ignore';
import changed from 'metalsmith-changed';
import {report} from 'metalsmith-debug-ui';

import yargs from 'yargs';

import gingabulousLayouts from '../plugins/metalsmith-gingabulous-pug';
// import DEPLOY from '../config';

// QUESTION Do I still need to solve any precompiling issues for markdown
// in metadata, or pug for that matter? (styleguide stuff).

function runMetalsmith(config, done) {
  const {
    metadata,
    workingDir,
    src,
    dest,
    collections,
    pugOptions
  } = config;
  const DEPLOY = yargs.argv.production;
  const ms = metalsmith(workingDir);
  console.log(DEPLOY);
  // console.log(config);
  ms
    .metadata(metadata)
    .source(src)
    .destination(dest)
    .clean(false)
    .use(branch()
      .pattern(collections.precompile)
      .use(gingabulousLayouts({inPlace: true, ...pugOptions}))
    )
    .use(collection(collections.defined));

    if (!DEPLOY) ms.use(report('After Collections Gathered'));
    
    ms.use(collectionMetadata(collections.defaults));

    if (!DEPLOY) ms.use(report('Collection Defaults Handled'));

    // This needs to replace the old del task for collections that aren't
    // outputted
    ms.use(ignore(collections.ignore));

    if (!DEPLOY) ms.use(changed());

    ms.use(gingabulousLayouts(pugOptions));

    if (!DEPLOY) ms.use(report('Pug Processed'));

    ms.use(
      prism({
        preLoad: ['markup-templating', 'clike', 'markup']
      })
    )

    // .use(permalinks({
    //   unique: true
    // }))
    ms.use(permalinks());

    if (!DEPLOY) ms.use(report('Permalinks Done'));

    ms.build(function(error) {
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
